// 스크롤에 따른 헤더 스타일 변경
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const a = document.querySelector('.header a');
    const link = document.querySelectorAll('.lnb');
    if (window.scrollY > 50) {
        header.classList.add('scrolled'),
            a.classList.add('scrolled'),
            link.forEach(lnb => lnb.classList.add('scrolled'));
    } else {
        header.classList.remove('scrolled'),
            a.classList.remove('scrolled'),
            link.forEach(lnb => lnb.classList.remove('scrolled'));
    }
});

// 채팅 위젯 토글
const chatButton = document.querySelector('.chat-button');
const chatWindow = document.querySelector('.chat-window');
const chatInput = document.querySelector('.chat-input input');
const chatMessages = document.querySelector('.chat-messages');

chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        // 사용자 메시지 추가
        const userMessage = document.createElement('div');
        userMessage.style.textAlign = 'right';
        userMessage.style.margin = '10px 0';
        userMessage.innerHTML = `<div style="background: #E7C49C; color: white; padding: 8px 12px; border-radius: 15px; display: inline-block;">${chatInput.value}</div>`;
        chatMessages.appendChild(userMessage);

        // 자동 응답 (예시)
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.style.margin = '10px 0';
            botMessage.innerHTML = `<div style="background: #f1f1f1; padding: 8px 12px; border-radius: 15px; display: inline-block;">안녕하세요! 대표가 잠수타서 잡으러 가야해요!</div>`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const mainImage = document.querySelector(".main-image");
    const subImages = document.querySelectorAll(".subImages .innerImg");

    subImages.forEach(image => {
        image.addEventListener("click", function () {
            // 페이드 아웃 효과 적용
            mainImage.style.opacity = "0.5";

            // 이미지 변경 후 페이드 인 효과 적용
            setTimeout(() => {
                mainImage.src = this.src;
                mainImage.style.opacity = "1"; // 페이드 인 효과
            }, 300); // 300ms 후에 이미지 변경
        });
    });
});

// common.js - 모든 페이지에 포함될 공통 스크립트
document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const navLinks = document.querySelector('.nav-links');
    
    if (userData && userData.isLoggedIn) {
        navLinks.innerHTML = `
            <a href="./product.html" class="lnb">매물찾기</a>
            <a href="./comunity.html" class="lnb">커뮤니티</a>
            <a href="./company.html" class="lnb">회사소개</a>
            <a href="./myPage.html" class="lnb">마이페이지</a>
            <a href="#" class="lnb" id="logoutBtn">${userData.name}님 로그아웃</a>
        `;
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('userData');
            localStorage.removeItem('rememberMe');
            window.location.reload();
        });
    }
 });

 // common.js - 모든 페이지에서 사용할 공통 스크립트
document.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태 확인 및 페이지 권한 체크
    const checkAuth = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        // 마이페이지인 경우 로그인 필수
        if (window.location.pathname.includes('myPage.html') && (!userData || !userData.isLoggedIn)) {
            window.location.href = 'login.html';
            return;
        }
 
        if (userData && userData.isLoggedIn) {
            updateNavigation(userData);
        }
    };
 
    // 네비게이션 메뉴 업데이트
    const updateNavigation = (userData) => {
        const navLinks = document.querySelector('.nav-links');
        navLinks.innerHTML = `
            <a href="./product.html" class="lnb">매물찾기</a>
            <a href="./comunity.html" class="lnb">커뮤니티</a>
            <a href="./company.html" class="lnb">회사소개</a>
            <a href="./myPage.html" class="lnb">마이페이지</a>
            <a href="#" class="lnb" id="logoutBtn">${userData.name}님 로그아웃</a>
        `;
 
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    };
 
    // 로그아웃 처리
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberMe');
        window.location.href = 'login.html';
    };
 
    // 페이지 로드 시 인증 체크 실행
    checkAuth();
 });