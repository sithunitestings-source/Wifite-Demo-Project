# Wifite-Demo-Project

A professional, educational web application designed for ethical hacking students to learn wireless security auditing workflows using a simulated Wifite environment.

<img width="1505" height="862" alt="image" src="https://github.com/user-attachments/assets/76e9e5bf-0f3f-4ce7-a645-ea2633b51c37" />

## 🚀 Overview
Wifite-Demo-Project provides a high-fidelity "Cybersecurity" aesthetic, mimicking specialized OS environments like NetHunter or Kali Linux. It allows students to experience the workflow of wireless attacks in a safe, visual, and interactive way.

## 💎 Features
- **Cyber Aesthetics**: Red/Black theme with glitch effects, scanlines, and glowing UI elements.
- **Wifite Simulation engine**: Automated boot sequence, scan results, and interactive attack simulations.
- **Discovery Bridge**: A Python-based bridge (`scanner.py`) that synchronizes real-world nearby wireless networks with the web application.
- **Credential Recovery**: Simulated dictionary attacks that can display actual recovered passwords for previously connected networks.
- **Responsive Terminal**: Interactive shell with auto-scrolling and custom "Cyber" scrollbars.

## 🛠️ Getting Started

### 1. Prerequisites
- A modern web browser.
- **Python 3.x** (for the real-world discovery bridge).

### 2. Installation
1. Download or clone this project to your local machine.
2. Open `index.html` in your browser.

### 3. Real-World Discovery (Optional)
To see actual networks around you in the simulation:
1. Open your terminal in the project folder.
2. Run the scanner script:
   ```bash
   python scanner.py
   ```
3. Refresh the `index.html` page in your browser.
4. Click **INITIALIZE WIFITE** to begin the audit.

## 📂 Project Structure
- `index.html`: Main UI and structure.
- `style.css`: Modern "Rich Aesthetics" design system.
- `main.js`: Terminal logic and bridge integration.
- `scanner.py`: hardware discovery tool.
- `screenshot.png`: Project preview.

## ⚠️ Disclaimer
This tool is for **educational purposes only**. Ethical hacking requires permission. Only use this environment and script on networks you are authorized to audit.
