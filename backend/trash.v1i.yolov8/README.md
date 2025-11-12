# 🧠 DeOlho NoLixo - IA de Detecção de Resíduos

O **DeOlho NoLixo** é um projeto que utiliza **Inteligência Artificial (YOLOv8)** para detectar e classificar resíduos sólidos em imagens, ajudando órgãos públicos a identificar pontos críticos de descarte irregular.

---

## 🚀 Tecnologias utilizadas

- **Python 3.10+**
- **Ultralytics YOLOv8**
- **PyTorch**
- **OpenCV**
- **Flask / FastAPI (backend)**
- **React Native (frontend - opcional)**

---

## ⚙️ Estrutura do Projeto

```bash
backend/
│
├── data.yaml
├── run_inference.py        
├── requirements.txt        
├── trash.v1i.yolov8/
│   ├── images/             
│   ├── labels/             
│   └── data.yaml           
│
└── runs/
    └── train/
        └── refined_train/
            └── weights/
                └── best.pt   

# 1️⃣ Clone o repositório
git clone https://github.com/seu-usuario/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App/backend

# 2️⃣ Crie um ambiente virtual
python -m venv venv

# 3️⃣ Ative o ambiente
# Windows:
venv\Scripts\activate
# Linux / Mac:
source venv/bin/activate

# 4️⃣ Instale as dependências
pip install -r requirements.txt

#Para Rodar a IA para detectar objetos, utilize o prompt de comando powershell dentro da pasta trash.v1.yolov8e e use o comando:
python run_inference.py


