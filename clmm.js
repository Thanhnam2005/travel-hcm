// Anti-Debugging và Content Protection
(function() {
    'use strict';

    // 1. Chống Debugging - Phát hiện DevTools
    let devtools = {
        open: false,
        orientation: null
    };

    // Phát hiện DevTools thông qua thay đổi kích thước cửa sổ
    function detectDevTools() {
        // Kiểm tra nếu là mobile device thì bỏ qua detection này
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth <= 768 ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);
        
        if (isMobile) {
            console.log('%c📱 Mobile device detected - Skipping DevTools size detection', 'color: #4ecdc4;');
            return; // Bỏ qua detection cho mobile
        }
        
        let threshold = 160;
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    handleDevToolsOpen();
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    }

    // Phát hiện DevTools thông qua console.log
    function detectConsole() {
        // Kiểm tra nếu là mobile device thì làm nhẹ hơn
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth <= 768 ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);
        
        if (isMobile) {
            // Trên mobile chỉ log warning, không trigger handleDevToolsOpen
            console.log('%c📱 Mobile console access detected', 'color: #ff9800;');
            return;
        }
        
        let devtools = {toString: function() { handleDevToolsOpen(); }};
        console.log('%c', devtools);
        
        // Kiểm tra thời gian thực thi (chỉ trên desktop)
        let start = performance.now();
        debugger;
        let end = performance.now();
        if (end - start > 100) {
            handleDevToolsOpen();
        }
    }

    // Xử lý khi phát hiện DevTools
    function handleDevToolsOpen() {
        // Tạo overlay che toàn bộ trang
        let overlay = document.createElement('div');
        overlay.id = 'protection-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg,rgb(47, 47, 47), #4ecdc4);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 24px;
            text-align: center;
            animation: pulse 2s infinite;
        `;
        overlay.innerHTML = `
            <div>
                <h2>🔒 Trang web được bảo vệ</h2>
                <p>Vui lòng đóng Developer Tools để tiếp tục</p>
                <p style="font-size: 16px; margin-top: 20px;">
                    Trang sẽ tự động reload sau 3 giây...
                </p>
            </div>
        `;
        
        // Thêm animation
        if (!document.getElementById('protection-style')) {
            let style = document.createElement('style');
            style.id = 'protection-style';
            style.textContent = `
                @keyframes pulse {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
        
        // Reload trang sau 3 giây
        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    // 2. Chặn chuột phải và phím tắt
    function disableInspect() {
        // Kiểm tra nếu là mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth <= 768 ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);

        // Chặn chuột phải (chỉ trên desktop vì mobile ít dùng)
        if (!isMobile) {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showWarning('Chuột phải đã bị vô hiệu hóa!');
                return false;
            });
        }

        // Chặn phím tắt (mobile thường không có physical keyboard)
        document.addEventListener('keydown', function(e) {
            // F12
            if (e.key === 'F12') {
                e.preventDefault();
                if (!isMobile) showWarning('F12 đã bị vô hiệu hóa!');
                return false;
            }
            
            // Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                if (!isMobile) showWarning('Ctrl+Shift+I đã bị vô hiệu hóa!');
                return false;
            }
            
            // Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                if (!isMobile) showWarning('Ctrl+Shift+J đã bị vô hiệu hóa!');
                return false;
            }
            
            // Ctrl+U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                if (!isMobile) showWarning('Ctrl+U đã bị vô hiệu hóa!');
                return false;
            }
            
            // Ctrl+Shift+C
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                if (!isMobile) showWarning('Ctrl+Shift+C đã bị vô hiệu hóa!');
                return false;
            }
            
            // Ctrl+S (Save)
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (!isMobile) showWarning('Lưu trang đã bị vô hiệu hóa!');
                return false;
            }
            
        });
    }

    // Hiển thị cảnh báo
    function showWarning(message) {
        let warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        warning.textContent = message;
        
        // Thêm CSS animation
        if (!document.getElementById('warning-style')) {
            let style = document.createElement('style');
            style.id = 'warning-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }
    // 4. Chống Save và Print
    function disableSaveAndPrint() {
        // Chặn Ctrl+P (Print)
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                showWarning('In trang đã bị vô hiệu hóa!');
                return false;
            }
        });
        
        // Chặn print từ menu
        window.addEventListener('beforeprint', function(e) {
            e.preventDefault();
            showWarning('In trang đã bị vô hiệu hóa!');
            return false;
        });
    }

    // 5. Bảo vệ hình ảnh
    function protectImages() {
        // Chặn kéo thả hình ảnh
        document.addEventListener('dragstart', function(e) {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });
        
        // Thêm CSS bảo vệ hình ảnh
        let style = document.createElement('style');
        style.textContent = `
            img {
                pointer-events: none;
                -webkit-user-drag: none;
                -moz-user-drag: none;
                -ms-user-drag: none;
                user-drag: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }

    // 6. Làm rối code (Obfuscation)
    function obfuscateConsole() {
        // Ghi đè console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function() {
            // Chỉ hiển thị thông báo bảo vệ
            originalLog('%c🔒 Console đã được bảo vệ', 'color: red; font-size: 16px; font-weight: bold;');
        };
        
        console.error = function() {
            originalError('%c🔒 Console đã được bảo vệ', 'color: red; font-size: 16px; font-weight: bold;');
        };
        
        console.warn = function() {
            originalWarn('%c🔒 Console đã được bảo vệ', 'color: red; font-size: 16px; font-weight: bold;');
        };
    }

    // 7. Phát hiện và chặn Extension
    function detectExtensions() {
        // Phát hiện một số extension phổ biến
        const extensionIds = [
            'fmkadmapgofadopljbjfkapdkoienihi', // React Developer Tools
            'lmhkpmbekcpmknklioeibfkpmmfibljd', // Redux DevTools
            'nhdogjmejiglipccpnnnanhbledajbpd', // Vue.js devtools
        ];
        
        extensionIds.forEach(id => {
            const img = new Image();
            img.src = `chrome-extension://${id}/manifest.json`;
            img.onload = function() {
                handleDevToolsOpen();
            };
        });
    }

    // 8. Tạo nhiễu cho Network Tab
    function createNetworkNoise() {
        setInterval(() => {
            // Tạo random request để làm nhiễu Network tab
            fetch('data:text/plain,noise' + Math.random())
                .catch(() => {});
        }, 1000);
    }

    // 9. Bảo vệ Source Code
    function protectSource() {
        // Mã hóa một số string quan trọng
        const protectedStrings = {
            'dearlove-backend.onrender.com': btoa('dearlove-backend.onrender.com'),
            'api/products': btoa('api/products'),
            'api/galaxies': btoa('api/galaxies')
        };
        
        // Thay thế các string trong code khi runtime
        Object.keys(protectedStrings).forEach(key => {
            if (window.location.href.includes(key)) {
                // Có thể thêm logic bảo vệ tại đây
            }
        });
    }

    // 10. Chống Debugger
    function antiDebugger() {
        setInterval(() => {
            debugger;
        }, 100);
    }

    // Khởi tạo tất cả các tính năng bảo vệ
    function initProtection() {
        // Kiểm tra device type
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                         window.innerWidth <= 768 ||
                         ('ontouchstart' in window) ||
                         (navigator.maxTouchPoints > 0);
        
        console.log('%c🔒 Trang web đã được bảo vệ', 'color: #ff6b9d; font-size: 20px; font-weight: bold;');
        console.log(`%c📱 Device: ${isMobile ? 'Mobile/Tablet' : 'Desktop'} - Protection level adjusted`, 'color: #4ecdc4; font-size: 14px;');
        console.log('%c⚠️ Cảnh báo: TUỔI LOZ CHÔM SOURCE ', 'color: red; font-size: 14px;');
        
        // Khởi tạo từng tính năng
        detectDevTools();
        disableInspect();
        disableSaveAndPrint();
        protectImages();
        obfuscateConsole();
        detectExtensions();
        createNetworkNoise();
        protectSource();
        
        // Chỉ bật anti-debugger trong production và trên desktop
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && !isMobile) {
            // antiDebugger(); // Uncomment để bật
        }
        
        // Phát hiện console với interval (tần suất thấp hơn trên mobile)
        setInterval(detectConsole, isMobile ? 5000 : 1000);
    }

    // Khởi tạo khi DOM loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }

    // Bảo vệ chống modify script
    Object.freeze(this);
    
})();

// Thêm thông báo copyright
console.log('%c© 2025 TnamTricker - Trang web được bảo vệ bởi hệ thống anti-debugging', 'background: linear-gradient(45deg,rgb(34, 34, 34), #4ecdc4); color: white; padding: 10px; border-radius: 5px; font-weight: bold;');