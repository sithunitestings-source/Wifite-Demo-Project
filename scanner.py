import subprocess
import json
import os
import re
import random

def get_saved_password(ssid):
    """Try to retrieve the saved password for a given SSID."""
    try:
        output = subprocess.check_output(f'netsh wlan show profile name="{ssid}" key=clear', 
                                         shell=True, encoding='utf-8', errors='ignore')
        match = re.search(r"Key Content\s*:\s*(.*)", output)
        if match:
            return match.group(1).strip()
    except:
        pass
    return None

def scan_wifi():
    print("="*50)
    print("   WIFITE-OS | HARDWARE BRIDGE & SCANNER")
    print("="*50)
    print("[*] Initializing wireless adapter...")
    
    try:
        # Get list of networks
        output = subprocess.check_output(["netsh", "wlan", "show", "networks"], encoding='utf-8', errors='ignore')
        
        networks = []
        ssids = re.findall(r"SSID \d+ : (.*)", output)
        
        print(f"[*] Found {len(ssids)} visible networks nearby.")
        
        for ssid in ssids:
            ssid = ssid.strip()
            if not ssid: continue
            
            print(f"[*] Auditing {ssid}...")
            
            # Try to get saved password for real practice simulation
            password = get_saved_password(ssid)
            
            networks.append({
                "ssid": ssid,
                "channel": random.randint(1, 11),
                "encryption": "WPA2",
                "power": f"{random.randint(15, 60)}dB",
                "wps": "yes" if random.random() > 0.5 else "no",
                "clients": random.randint(0, 10),
                "password": password # This will be used in the web app simulation
            })
        
        # Write results to JS file
        data_js = f"window.REAL_NETWORKS = {json.dumps(networks, indent=4)};"
        
        with open("real_networks.js", "w") as f:
            f.write(data_js)
            
        print("="*50)
        print(f"[+] SUCCESS: {len(networks)} networks synchronized.")
        print("[+] ACTION: Now refresh your browser and click 'INITIALIZE WIFITE'.")
        print("="*50)
        
    except Exception as e:
        print(f"[-] FATAL ERROR: {e}")
        print("[-] Ensure your WiFi adapter is turned on.")

if __name__ == "__main__":
    scan_wifi()
