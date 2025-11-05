#!/usr/bin/env python3
"""
Script to sync kanban.yml with GitHub Projects using GraphQL API.
"""

import os
import sys
import yaml
import requests
import json

# GitHub GraphQL API endpoint
GRAPHQL_URL = "https://api.github.com/graphql"

# Get environment variables
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
PROJECT_NUMBER = os.environ.get("PROJECT_NUMBER")
REPO_OWNER = os.environ.get("GITHUB_REPOSITORY_OWNER", "Alejjandromart")

if not GITHUB_TOKEN:
    print("Error: GITHUB_TOKEN environment variable not set")
    sys.exit(1)

if not PROJECT_NUMBER:
    print("Error: PROJECT_NUMBER variable not set. Please set it in repository variables.")
    print("Go to: Settings > Secrets and variables > Actions > Variables")
    print("Create a new variable named PROJECT_NUMBER with the number from your project URL")
    sys.exit(1)


def graphql_query(query, variables=None):
    """Execute a GraphQL query."""
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json",
    }
    
    payload = {"query": query}
    if variables:
        payload["variables"] = variables
    
    response = requests.post(GRAPHQL_URL, json=payload, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: GraphQL query failed with status {response.status_code}")
        print(f"Response: {response.text}")
        sys.exit(1)
    
    data = response.json()
    if "errors" in data:
        print(f"GraphQL Errors: {json.dumps(data['errors'], indent=2)}")
        sys.exit(1)
    
    return data


def get_project_id():
    """Get the project ID from the project number."""
    query = """
    query($owner: String!, $number: Int!) {
      user(login: $owner) {
        projectV2(number: $number) {
          id
          title
          fields(first: 20) {
            nodes {
              ... on ProjectV2Field {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
    """
    
    variables = {
        "owner": REPO_OWNER,
        "number": int(PROJECT_NUMBER)
    }
    
    result = graphql_query(query, variables)
    
    if not result.get("data", {}).get("user", {}).get("projectV2"):
        print(f"Error: Project {PROJECT_NUMBER} not found for user {REPO_OWNER}")
        sys.exit(1)
    
    return result["data"]["user"]["projectV2"]


def get_project_items(project_id):
    """Get existing items in the project."""
    query = """
    query($projectId: ID!) {
      node(id: $projectId) {
        ... on ProjectV2 {
          items(first: 100) {
            nodes {
              id
              content {
                ... on DraftIssue {
                  title
                  body
                }
              }
            }
          }
        }
      }
    }
    """
    
    variables = {"projectId": project_id}
    result = graphql_query(query, variables)
    
    return result["data"]["node"]["items"]["nodes"]


def create_draft_issue(project_id, title, body):
    """Create a draft issue in the project."""
    mutation = """
    mutation($projectId: ID!, $title: String!, $body: String!) {
      addProjectV2DraftIssue(input: {
        projectId: $projectId
        title: $title
        body: $body
      }) {
        projectItem {
          id
        }
      }
    }
    """
    
    variables = {
        "projectId": project_id,
        "title": title,
        "body": body
    }
    
    result = graphql_query(mutation, variables)
    return result["data"]["addProjectV2DraftIssue"]["projectItem"]["id"]


def update_item_field(project_id, item_id, field_id, value):
    """Update a field value for a project item."""
    mutation = """
    mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $value: ProjectV2FieldValue!) {
      updateProjectV2ItemFieldValue(input: {
        projectId: $projectId
        itemId: $itemId
        fieldId: $fieldId
        value: $value
      }) {
        projectV2Item {
          id
        }
      }
    }
    """
    
    variables = {
        "projectId": project_id,
        "itemId": item_id,
        "fieldId": field_id,
        "value": value
    }
    
    result = graphql_query(mutation, variables)
    return result


def format_task_body(task):
    """Format task details as markdown body."""
    body = f"""**Área:** {task.get('area', 'N/A')}
**Responsável:** {task.get('responsavel', 'N/A')}
**Prioridade:** {task.get('prioridade', 'N/A')}
**Tempo Estimado:** {task.get('tempo_estimado', 'N/A')}

**Descrição:**
{task.get('descricao', 'N/A').strip()}

**Requisitos:** {', '.join(task.get('requisitos', []))}
**Dependências:** {', '.join(task.get('dependencias', []))}
**Status:** {task.get('status', 'N/A')}
"""
    return body


def main():
    """Main function to sync kanban.yml with GitHub Projects."""
    print("🔄 Starting Kanban sync to GitHub Projects...")
    
    # Load kanban.yml
    try:
        with open("kanban.yml", "r", encoding="utf-8") as f:
            kanban_data = yaml.safe_load(f)
    except FileNotFoundError:
        print("Error: kanban.yml not found")
        sys.exit(1)
    except yaml.YAMLError as e:
        print(f"Error parsing kanban.yml: {e}")
        sys.exit(1)
    
    kanban = kanban_data.get("kanban", {})
    tasks = kanban.get("tasks", [])
    
    print(f"📋 Found {len(tasks)} tasks in kanban.yml")
    
    # Get project information
    project = get_project_id()
    project_id = project["id"]
    project_title = project["title"]
    
    print(f"📊 Connected to project: {project_title}")
    print(f"   Project ID: {project_id}")
    
    # Get existing items
    existing_items = get_project_items(project_id)
    existing_titles = {
        item.get("content", {}).get("title", "") 
        for item in existing_items 
        if item.get("content")
    }
    
    print(f"📝 Found {len(existing_titles)} existing items in project")
    
    # Sync tasks
    created_count = 0
    skipped_count = 0
    
    for task in tasks:
        title = task.get("title", "Untitled")
        
        # Check if task already exists
        if title in existing_titles:
            print(f"⏭️  Skipping existing task: {title}")
            skipped_count += 1
            continue
        
        # Create new draft issue
        print(f"➕ Creating task: {title}")
        body = format_task_body(task)
        
        try:
            item_id = create_draft_issue(project_id, title, body)
            print(f"   ✅ Created item ID: {item_id}")
            created_count += 1
        except Exception as e:
            print(f"   ❌ Error creating task: {e}")
    
    # Summary
    print("\n" + "="*60)
    print("📊 Sync Summary:")
    print(f"   ✅ Created: {created_count} tasks")
    print(f"   ⏭️  Skipped: {skipped_count} tasks (already exist)")
    print(f"   📋 Total: {len(tasks)} tasks in kanban.yml")
    print("="*60)
    
    if created_count > 0:
        print("\n✨ Sync completed successfully!")
    else:
        print("\n✨ All tasks already synced!")


if __name__ == "__main__":
    main()
