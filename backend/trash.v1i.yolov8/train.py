from ultralytics import YOLO

# Modelo base (leve e ideal para GPU 1650)
model = YOLO("yolov8n.pt")

# Treinamento
results = model.train(
    data="data.yaml",      # caminho do seu arquivo
    epochs=80,             # número de épocas — suficiente para dataset pequeno
    imgsz=640,             # resolução padrão (pode reduzir se faltar VRAM)
    batch=8,               # GTX 1650 costuma aguentar até 8 com 640x640
    device= "cpu",              # usa GPU 0 (1650)
    workers=2,             # menos threads evita sobrecarga de RAM
    lr0=0.001,             # taxa de aprendizado inicial
    lrf=0.01,              # fator de decaimento da LR
    momentum=0.937,        # momentum padrão do SGD
    weight_decay=0.0005,   # regularização leve
    warmup_epochs=3,       # algumas épocas de aquecimento
    hsv_h=0.015,           # leve variação de matiz
    hsv_s=0.7,             # saturação aumentada
    hsv_v=0.4,             # variação de brilho
    flipud=0.0,            # sem flip vertical (não faz sentido em muitos casos)
    fliplr=0.5,            # flip horizontal
    mosaic=0.7,            # bom para generalização com pouco dado
    mixup=0.2,             # aumenta a diversidade do dataset
    patience=15,           # early stopping
    name="yolov8n_1classe_gtx1650",
    project="runs/train"
)
