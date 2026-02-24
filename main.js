(function () {
    const welcomeScreen = document.getElementById('welcome-screen');
    const terminalContainer = document.getElementById('terminal-container');
    const terminal = document.getElementById('terminal');
    const learnBtn = document.getElementById('learn-btn');

    let isTerminalActive = false;
    let currentCommand = '';
    let prompt = 'wifite@learning-shell:~$ ';

    const wifiteSim = [
        { text: '  .               .', color: '#ff0000', delay: 100 },
        { text: ' .´  ·  .     .  ·  `.', color: '#ff0000', delay: 100 },
        { text: ' :  :  :  (¯)  :  :  :', color: '#ff0000', delay: 100 },
        { text: ' `.  ·  `  \'  ´  ·  .´', color: '#ff0000', delay: 100 },
        { text: '   `     wifite     \'', color: '#ff0000', delay: 100 },
        { text: ' ', delay: 200 },
        { text: '[+] initializing wifite v2.5.8', delay: 500 },
        { text: '[+] checking dependencies...', delay: 800 },
        { text: '[+] tshark: found', color: '#00ff00', delay: 300 },
        { text: '[+] reaver: found', color: '#00ff00', delay: 300 },
        { text: '[+] bully:  found', color: '#00ff00', delay: 300 },
        { text: '[+] pyrit:  found', color: '#00ff00', delay: 300 },
        { text: ' ', delay: 500 },
        { text: '[!] enabling monitor mode on wlan0...', delay: 1000 },
        { text: '[+] enabled monitor mode on wlan0mon', color: '#00ff00', delay: 500 },
        { text: ' ', delay: 500 },
        { text: '[+] scanning for wireless networks...', delay: 1000 },
        { text: ' ', delay: 500 },
        { text: '  #  ESSID               CH  ENCR  POWER  WPS  CLIENT', color: '#ff0000', delay: 0 },
        { text: '  -  ------------------  --  ----  -----  ---  ------', color: '#ff0000', delay: 0 },
        { text: '  1  TP-Link_CA5F        1   WPA2  45dB   no   2', delay: 1500 },
        { text: '  2  Cyber_Lab_5G        6   WPA2  32dB   yes  5', delay: 300 },
        { text: '  3  Starlink_Alpha      11  WPA2  21dB   no   0', delay: 400 },
        { text: '  4  Free_Airport_WiFi   1   OPEN  15dB   no   12', delay: 200 },
        { text: ' ', delay: 500 },
        { text: '[+] select target index (1-4) or [ctrl+c] to stop:', color: '#ff0000', delay: 500 }
    ];

    function writeLine(text, color = '#ffffff', delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.style.color = color;
                line.style.marginBottom = '4px';
                line.textContent = text;
                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;

                // Play subtle beep sound if enabled/possible
                playBeep(440, 0.01);

                resolve();
            }, delay);
        });
    }

    function playBeep(freq, duration) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'square';
            oscillator.frequency.value = freq;
            gainNode.gain.value = 0.02;

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                audioCtx.close();
            }, duration * 1000);
        } catch (e) { }
    }

    async function runWifiteSimulation() {
        // Check if real networks were discovered by the bridge script
        if (window.REAL_NETWORKS && window.REAL_NETWORKS.length > 0) {
            console.log("Real networks detected, updating simulation...");

            // Find the scan result header index
            const headerIndex = wifiteSim.findIndex(step => step.text.includes('ESSID'));
            if (headerIndex !== -1) {
                // Clear the default mock networks (4 lines after header)
                wifiteSim.splice(headerIndex + 2, 4);

                // Add real networks
                window.REAL_NETWORKS.forEach((net, i) => {
                    const row = `  ${i + 1}  ${net.ssid.padEnd(18)}  ${String(net.channel).padEnd(2)}  ${net.encryption.padEnd(4)}  ${net.power.padEnd(5)}  ${net.wps.padEnd(3)}  ${net.clients}`;
                    wifiteSim.splice(headerIndex + 2 + i, 0, { text: row, delay: 200 });
                });

                // Update final selection prompt
                const lastStep = wifiteSim[wifiteSim.length - 1];
                lastStep.text = `[+] select target index (1-${window.REAL_NETWORKS.length}) or [ctrl+c] to stop:`;
            }
        }

        for (const step of wifiteSim) {
            await writeLine(step.text, step.color || '#ffffff', step.delay);
        }
        isTerminalActive = true;
        createPrompt();
    }

    function createPrompt() {
        const promptLine = document.createElement('div');
        promptLine.className = 'prompt-line';
        promptLine.innerHTML = `<span style="color: #ff0000">${prompt}</span><span class="input-container"></span><span class="cursor">_</span>`;
        terminal.appendChild(promptLine);
        terminal.scrollTop = terminal.scrollHeight;
    }

    learnBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        terminalContainer.classList.remove('hidden');
        runWifiteSimulation();
    });

    // Forced download & Copy logic for scanner.py
    const downloadLink = document.getElementById('download-link');
    const copyBtn = document.getElementById('copy-btn');
    const copyStatus = document.getElementById('copy-status');

    const pyContent = `import subprocess
import json
import os
import re
import random

def get_saved_password(ssid):
    """Try to retrieve the saved password for a given SSID."""
    try:
        output = subprocess.check_output(f'netsh wlan show profile name="{ssid}" key=clear', 
                                         shell=True, encoding='utf-8', errors='ignore')
        match = re.search(r"Key Content\\s*:\\s*(.*)", output)
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
        ssids = re.findall(r"SSID \\d+ : (.*)", output)
        
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
    scan_wifi()`;

    if (downloadLink) {
        downloadLink.addEventListener('click', (e) => {
            e.preventDefault();
            const blob = new Blob([pyContent], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'scanner.py';
            a.setAttribute('download', 'scanner.py');
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }, 100);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(pyContent).then(() => {
                copyStatus.textContent = 'CODE COPIED TO CLIPBOARD! Create a file named scanner.py and paste it.';
                setTimeout(() => { copyStatus.textContent = ''; }, 5000);
            }).catch(err => {
                copyStatus.textContent = 'Error copying code. Please select and copy manually.';
            });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!isTerminalActive) return;

        const inputContainers = document.querySelectorAll('.input-container');
        const activeInput = inputContainers[inputContainers.length - 1];

        if (e.key === 'Enter') {
            const cmd = currentCommand.trim();
            currentCommand = '';

            // Handle simulation logic
            handleCommand(cmd);
        } else if (e.key === 'Backspace') {
            currentCommand = currentCommand.slice(0, -1);
            activeInput.textContent = currentCommand;
        } else if (e.key.length === 1) {
            currentCommand += e.key;
            activeInput.textContent = currentCommand;
        }
    });

    async function handleCommand(cmd) {
        // Stop the blinking cursor on the previous line
        const cursors = document.querySelectorAll('.cursor');
        if (cursors.length > 0) {
            cursors[cursors.length - 1].classList.remove('cursor');
            cursors[cursors.length - 1].textContent = '';
        }

        if (cmd === '1' || cmd === '2' || cmd === '3' || cmd === '4' || (window.REAL_NETWORKS && parseInt(cmd) <= window.REAL_NETWORKS.length)) {
            const index = parseInt(cmd) - 1;
            const targetNet = (window.REAL_NETWORKS && window.REAL_NETWORKS[index]) ? window.REAL_NETWORKS[index] : null;
            const targetName = targetNet ? targetNet.ssid : `target ${cmd}`;
            const targetPass = targetNet && targetNet.password ? targetNet.password : "password123";

            await writeLine(`[+] target selected: ${targetName}`, '#00ff00', 500);
            await writeLine(`[+] starting attack on target...`, '#ffffff', 500);
            await writeLine(`[!] performing handshake capture...`, '#00ff00', 1500);
            await writeLine(`[+] handshake captured!`, '#00ff00', 1000);
            await writeLine(`[+] starting dictionary attack (rockyou.txt)...`, '#ffffff', 500);
            await writeLine(`[+] passphrase found: ${targetPass}`, '#00ff00', 2000);
        } else if (cmd === 'exit') {
            await writeLine('Exiting simulation...', '#ff0000', 500);
            setTimeout(() => location.reload(), 1500);
            return;
        } else if (cmd === 'help') {
            await writeLine('Available commands:', '#ff0000', 100);
            await writeLine('  1-4   - Select wireless target', '#ffffff', 50);
            await writeLine('  ls    - List directory contents', '#ffffff', 50);
            await writeLine('  clear - Clear terminal screen', '#ffffff', 50);
            await writeLine('  help  - Show this help message', '#ffffff', 50);
            await writeLine('  exit  - Close wifite simulation', '#ffffff', 50);
        } else if (cmd === 'ls') {
            await writeLine('handshakes/  logs/  wifite.py  rockyou.txt', '#ffffff', 100);
        } else if (cmd === 'clear') {
            terminal.innerHTML = '';
        } else if (cmd !== '') {
            await writeLine(`Command not recognized: ${cmd}`, '#ff0000', 100);
        } else {
            await writeLine('', '#ffffff', 0);
        }

        createPrompt();
    }

    // Add cursor animation style
    const style = document.createElement('style');
    style.textContent = `
        .cursor {
            animation: blink 1s step-end infinite;
            color: #ff0000;
            font-weight: bold;
        }
        @keyframes blink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
        }
        .prompt-line {
            display: flex;
            gap: 5px;
            margin-bottom: 4px;
        }
        .input-container {
            word-break: break-all;
        }
    `;
    document.head.appendChild(style);
})();
