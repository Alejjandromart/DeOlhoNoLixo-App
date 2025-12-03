# 🧠 DeOlho NoLixo - IA de Detecção de Resíduos

O **DeOlho NoLixo** é um projeto que utiliza **Inteligência Artificial (YOLOv8)** para detectar e classificar resíduos sólidos em imagens, ajudando órgãos públicos a identificar pontos críticos de descarte irregular.

---

## 🚀 Tecnologias utilizadas

- **Python 3.10+**
- **Ultralytics YOLOv8**
- **PyTorch**
- **OpenCV**
- **Flask** (ou **FastAPI**, conforme implementação)
- **React Native** (frontend - opcional)

---

## ⚙️ Estrutura do Projeto

* backend
    * data
    * ai
        * trash.v1.yolov8
            * runs
                * refined_train
                    * weights
                        * best.pt
                * train
                * test
                * train
                * valid
                * data.yaml
            * README.md
            * run_inference.py
            * train.py
            * yolov8n.pt
    * venv
    * requirements.txt
    * runs

# 1️ Clone o repositório
git clone https://github.com/seu-usuario/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App/backend

# 2️ Crie um ambiente virtual, OBS: A pasta do venv deve estar dentro da pasta do backend junto a pasta trash.v1i.yolov8
python -m venv venv

# 3️ Ative o ambiente
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# 4️ Instale as dependências
pip install -r requirements.txt


# 5 Dentro da Pasta trash.v1i.yolov8 rode o prompt de comando do powershell e utilize o comando:
python run_inference.py
