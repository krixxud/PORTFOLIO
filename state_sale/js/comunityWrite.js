// 태그 입력 처리
        const tagInput = document.getElementById('tagInput');
        const tagContainer = document.getElementById('tagContainer');
        let tags = [];

        tagInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && tagInput.value.trim() !== '') {
                e.preventDefault();
                const tagValue = tagInput.value.trim();
                if (!tags.includes(tagValue)) {
                    tags.push(tagValue);
                    renderTags();
                }
                tagInput.value = '';
            }
        });

        function renderTags() {
            const tagsHTML = tags.map(tag => `
                <div class="tag">
                    ${tag}
                    <button type="button" onclick="removeTag('${tag}')">&times;</button>
                </div>
            `).join('');
            
            tagContainer.innerHTML = tagsHTML + `
                <input type="text" class="tag-input" id="tagInput" placeholder="태그를 입력하고 Enter를 누르세요">
            `;
            
            // 새로운 input 요소에 이벤트 리스너 다시 추가
            document.getElementById('tagInput').addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                    e.preventDefault();
                    const tagValue = e.target.value.trim();
                    if (!tags.includes(tagValue)) {
                        tags.push(tagValue);
                        renderTags();
                    }
                    e.target.value = '';
                }
            });
        }

        function removeTag(tagToRemove) {
            tags = tags.filter(tag => tag !== tagToRemove);
            renderTags();
        }

        // 이미지 업로드 처리
        const imageUpload = document.getElementById('imageUpload');
        const fileInput = document.getElementById('fileInput');

        imageUpload.addEventListener('click', () => {
            fileInput.click();
        });

        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.style.borderColor = '#E7C49C';
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.style.borderColor = '#ddd';
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.style.borderColor = '#ddd';
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        function handleFiles(files) {
            // 여기에 파일 처리 로직 추가
            console.log('Selected files:', files);
        }

        document.addEventListener('DOMContentLoaded', () => {
            // 로그인 상태 확인
            const userData = JSON.parse(localStorage.getItem('userData'));
            
            // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
            if (!userData || !userData.isLoggedIn) {
                alert('로그인이 필요한 서비스입니다.');
                window.location.href = 'login.html';
                return;
            }
        
            const writeForm = document.getElementById('writeForm');
            
            writeForm.addEventListener('submit', (e) => {
                e.preventDefault();
        
                // userData에서 사용자 정보 가져오기
                const post = {
                    id: Date.now(),
                    category: document.getElementById('category').value,
                    title: document.getElementById('title').value,
                    content: document.getElementById('content').value,
                    author: userData.name, // 실제 사용자 이름 사용
                    views: 0,
                    comments: 0,
                    date: new Date().toLocaleDateString()
                };
                
                // 기존 게시글 불러오기 또는 새 배열 생성
                const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
                
                // 새 게시글 추가
                posts.unshift(post);
                
                // localStorage에 저장
                localStorage.setItem('communityPosts', JSON.stringify(posts));
        
                alert('글이 성공적으로 등록되었습니다.');
                
                // 커뮤니티 페이지로 리다이렉트
                window.location.href = './comunity.html';
            });
        
            // 나머지 태그 입력과 이미지 업로드 관련 코드는 그대로 유지
        });