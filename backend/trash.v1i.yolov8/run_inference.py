import torch
from ultralytics import YOLO
import cv2

device = 0 if torch.cuda.is_available() else 'cpu'
print(f"Usando dispositivo: {'GPU' if device == 0 else 'CPU'}")


model_path = "../trash.v1i.yolov8/runs/refined_train/weights/best.pt"

model = YOLO(model_path)


image_path = "ImagemTeste1.jpg"
results = model.predict(source=image_path, device=device, imgsz=640, conf=0.5, save=True)

for r in results:
    print("Detecções:")
    r.show()      
    print(r.boxes)  

print("\nResultados salvos em:", results[0].save_dir)
