// 회원 유형에 따른 필드 표시
document.getElementById('userType').addEventListener('change', function() {
    const agentFields = document.getElementById('agentFields');
    if (this.value === 'agent') {
        agentFields.style.display = 'block';
    } else {
        agentFields.style.display = 'none';
    }
});

// 전체 동의 처리
document.getElementById('agreeAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.terms-individual input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = this.checked);
});

// 이메일 중복 확인
function verifyEmail() {
    const email = document.getElementById('email').value;
    // API 호출 로직 구현
    alert('이메일 중복 확인이 완료되었습니다.');
}

// 휴대폰 인증
function sendVerification() {
    const phone = document.getElementById('phone').value;
    // SMS 인증 로직 구현
    alert('인증번호가 전송되었습니다.');
}

// 폼 제출 처리
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 폼 데이터 수집
    const formData = {
        userType: document.getElementById('userType').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        agreeMarketing: document.getElementById('agreeMarketing').checked
    };

    // 중개사일 경우 추가 정보 수집
    if (formData.userType === 'agent') {
        formData.licenseNumber = document.getElementById('licenseNumber').value;
        formData.officeName = document.getElementById('officeName').value;
        formData.officeAddress = document.getElementById('officeAddress').value;
    }

    // API 엔드포인트로 데이터 전송
    fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.JSON())
    .then(data => {
        if (data.success) {
            alert('회원가입이 완료되었습니다.');
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('회원가입 중 오류가 발생했습니다.');
    });
});