
// 탭 전환 기능
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 모든 탭 버튼에서 active 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // 클릭된 버튼에 active 클래스 추가
        button.classList.add('active');

        // 모든 탭 컨텐츠 숨기기
        tabContents.forEach(content => content.classList.remove('active'));
        // 선택된 탭의 컨텐츠 보이기
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

// 프로필 수정 모달 관련 기능
const modal = document.getElementById('profileModal');
const editProfileBtn = document.getElementById('editProfileBtn');
const closeModal = document.querySelector('.close-modal');
const profileForm = document.getElementById('profileForm');
const profileImageInput = document.getElementById('profileImageInput');

// 모달 열기
editProfileBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// 모달 닫기
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// 프로필 이미지 변경
document.addEventListener('DOMContentLoaded', () => {
    const profileImageInput = document.getElementById('file');
    
    if (profileImageInput) {
        profileImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const profileImages = document.querySelectorAll('.profile-image');
                    profileImages.forEach(image => {
                        image.innerHTML = `<img src="${e.target.result}" alt="프로필 이미지" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    } else {
        console.error('profileImageInput 요소를 찾을 수 없습니다.');
    }
});

// 프로필 정보 수정
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 입력된 정보 가져오기
    const newName = document.getElementById('nameInput').value;
    const newEmail = document.getElementById('emailInput').value;

    // 프로필 정보 업데이트
    document.getElementById('profileName').textContent = newName + '님';
    document.getElementById('profileEmail').textContent = newEmail;

    // 모달 닫기
    modal.style.display = 'none';
});

// // mypage.js - 마이페이지 인증 및 데이터 관리
// document.addEventListener('DOMContentLoaded', () => {
//     // 로그인 상태 확인
//     const checkAuth = () => {
//         const userData = JSON.parse(localStorage.getItem('userData'));

//         if (!userData || !userData.isLoggedIn) {
//             // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
//             window.location.href = 'login.html';
//             return;
//         }

//         // 로그인 상태인 경우 사용자 정보 표시
//         updateUserProfile(userData);
//         updateNavigation(true);
//     };

// 사용자 프로필 정보 업데이트
// const updateUserProfile = (userData) => {
//     document.getElementById('profileName').textContent = userData.name + '님';
//     document.getElementById('profileEmail').textContent = userData.email;

// if (userData.profileImage) {
//     const profileImages = document.querySelectorAll('.profile-image');
//     profileImages.forEach(image => {
//         image.innerHTML = `<img src="${userData.profileImage}" alt="프로필 이미지" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
//     });
// }


//         // 프로필 수정 폼 초기값 설정
//         document.getElementById('nameInput').value = userData.name;
//         document.getElementById('emailInput').value = userData.email;
//     };

//     // 네비게이션 메뉴 업데이트
//     const updateNavigation = (isLoggedIn) => {
//         const navLinks = document.querySelector('.nav-links');
//         const loginLink = navLinks.querySelector('a[href="./login.html"]');

//         if (isLoggedIn) {
//             // 로그인 링크를 로그아웃 링크로 변경
//             loginLink.textContent = '로그아웃';
//             loginLink.href = '#';
//             loginLink.addEventListener('click', handleLogout);
//         }
//     };

//     // 로그아웃 처리
//     const handleLogout = (e) => {
//         e.preventDefault();
//         localStorage.removeItem('userData');
//         localStorage.removeItem('rememberMe');
//         window.location.href = 'login.html';
//     };

// 프로필 수정 처리
// document.getElementById('profileForm').addEventListener('submit', (e) => {
//     e.preventDefault();

//     const newName = document.getElementById('nameInput').value;
//     const newEmail = document.getElementById('emailInput').value;

//     // localStorage의 사용자 정보 업데이트
//     const userData = JSON.parse(localStorage.getItem('userData'));
//     userData.name = newName;
//     userData.email = newEmail;

//     localStorage.setItem('userData', JSON.stringify(userData));

//     // 화면 업데이트
//     document.getElementById('profileName').textContent = newName + '님';
//     document.getElementById('profileEmail').textContent = newEmail;

//     // 프로필 이미지가 변경된 경우
//     document.addEventListener('DOMContentLoaded', () => {
//         const profileImageInput = document.getElementById('file');
//         const profileImageContainer = document.getElementById('profileImage');
    
//         // 이미지 변경 이벤트 핸들러
//         profileImageInput.addEventListener('change', (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     // 이미지 업데이트
//                     updateProfileImage(e.target.result);
//                     // 로컬 스토리지에 이미지 저장
//                     localStorage.setItem('profileImage', e.target.result);
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });
    
//         // 로컬 스토리지 이미지 로드
//         const savedImage = localStorage.getItem('profileImage');
//         if (savedImage) {
//             updateProfileImage(savedImage);
//         }
    
//         // 이미지 업데이트 함수
//         function updateProfileImage(imageSrc) {
//             profileImageContainer.innerHTML = '';
//             const img = document.createElement('img');
//             img.src = imageSrc;
//             img.style.width = '100px';
//             img.style.height = '100px';
//             img.style.borderRadius = '50%';
//             profileImageContainer.appendChild(img);
//         }
//     });

        // 모달 닫기
        document.getElementById('profileModal').style.display = 'none';


    // 페이지 로드 시 인증 체크 실행
    checkAuth();
