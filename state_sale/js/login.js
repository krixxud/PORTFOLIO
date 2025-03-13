// 로그인 폼 제출 처리
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 여기에 로그인 처리 로직 추가
    console.log('로그인 시도:', { email, password });
});

// login.js - 로그인 페이지 스크립트
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;

    // 실제 서버 연동 전 테스트용 사용자 정보
    const testUser = {
        email: 'kky183881@gmail.com',
        password: 'oka1838!',
        name: '권기영',
        profileImage: null
    };

    // 로그인 검증
    if (email === testUser.email && password === testUser.password) {
        // 로그인 성공 시 사용자 정보 저장
        const userData = {
            isLoggedIn: true,
            email: testUser.email,
            name: testUser.name,
            profileImage: testUser.profileImage,
            loginTime: new Date().getTime()
        };

        // localStorage에 사용자 정보 저장
        localStorage.setItem('userData', JSON.stringify(userData));

        // 로그인 상태 유지 체크 시
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        // 마이페이지로 리다이렉트
        window.location.href = 'index.html';
    } else {
        alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    }
});

// 로그인 성공 시
localStorage.setItem('currentUser', JSON.stringify({
    username: '권기영'
}));