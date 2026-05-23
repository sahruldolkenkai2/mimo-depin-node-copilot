#!/usr/bin/env python3
import os
from PIL import Image

def create_demo_gif():
    # List of screenshots in order
    screenshots = [
        'dashboard.png',
        'analyzer.png',
        'health.png',
        'automation.png',
        'history.png',
        'nodes.png'
    ]
    
    images = []
    
    print("📱 Creating demo GIF from screenshots...")
    
    for i, filename in enumerate(screenshots):
        path = os.path.join('screenshots', filename)
        if os.path.exists(path):
            print(f"  Adding: {filename}")
            img = Image.open(path)
            # Resize to 800x450 for reasonable GIF size
            img = img.resize((800, 450), Image.Resampling.LANCZOS)
            images.append(img)
        else:
            print(f"  Warning: {path} not found")
    
    if not images:
        print("❌ No images found!")
        return
    
    # Save as GIF
    output_path = 'screenshots/demo.gif'
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        duration=1000,  # 1 second per frame
        loop=0,  # infinite loop
        optimize=True
    )
    
    print(f"✅ Demo GIF created: {output_path}")
    print(f"   Size: {os.path.getsize(output_path) / 1024:.1f} KB")
    print(f"   Frames: {len(images)}")
    print(f"   Duration: {len(images)} seconds")

if __name__ == '__main__':
    create_demo_gif()
