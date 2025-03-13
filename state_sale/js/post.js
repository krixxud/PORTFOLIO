// URL에서 게시글 ID 가져오기
const urlParams = new URLSearchParams(window.location.search);
const postId = parseInt(urlParams.get('id'));

// 현재 로그인한 사용자 정보 가져오기
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

document.addEventListener('DOMContentLoaded', function() {
    // 로그인 상태 확인
    const checkAuth = () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && userData.isLoggedIn) {
            updateNavigation(userData);
        }
    };

    // 네비게이션 메뉴 업데이트
    const updateNavigation = (userData) => {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.innerHTML = `
                <a href="./product.html" class="lnb">매물찾기</a>
                <a href="./comunity.html" class="lnb">커뮤니티</a>
                <a href="./company.html" class="lnb">회사소개</a>
                <a href="./myPage.html" class="lnb">마이페이지</a>
                <a href="#" class="lnb" id="logoutBtn">${userData.name}님 로그아웃</a>
            `;

            // 로그아웃 버튼 이벤트 리스너
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('userData');
                localStorage.removeItem('rememberMe');
                window.location.href = 'login.html';
            });
        }
    };

    // 인증 체크 실행
    checkAuth();
    
    // 기존의 게시글 상세 관련 로직
    getPostDetail();
    
    // 좋아요 버튼 클릭 이벤트
    document.getElementById('likeButton').addEventListener('click', toggleLike);
    
    // 댓글 작성 버튼 클릭 이벤트
    document.querySelector('.comment-submit').addEventListener('click', addComment);
});

// 게시글 데이터 가져오기 및 표시
function getPostDetail() {
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const post = posts.find(p => p.id === postId);

    if (post) {
        // 조회수 증가
        post.views = (post.views || 0) + 1;
        localStorage.setItem('communityPosts', JSON.stringify(posts));

        // 좋아요 수 초기화
        post.likes = post.likes || [];

        // 카테고리 이름 변환 함수 추가
        function getCategoryName(category) {
            const categoryMap = {
                'qna': 'Q&A',
                'interior': '이사/인테리어',
                'review': '매매후기'
            };
            return categoryMap[category] || category;
        }

        // 게시글 상세 내용 표시
        const postDetailHtml = `
            <div class="post-header">
            <div class="post-category">${getCategoryName(post.category)}</div>
                    <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <span>작성자: ${post.author}</span>
                    <span>
                        <i class="far fa-eye"></i> ${post.views} &nbsp;
                        <i class="far fa-comment"></i> ${post.comments || 0} &nbsp;
                        ${post.date}
                    </span>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            ${currentUser && currentUser.username === post.author ? `
                <div class="post-management">
                    <button class="management-button delete" onclick="deletePost()">삭제</button>
                </div>
            ` : ''}
        `;

        document.getElementById('postDetail').innerHTML = postDetailHtml;

        // 좋아요 버튼 상태 업데이트
        updateLikeButton(post);

        // 댓글 표시
        loadComments();
    } else {
        document.getElementById('postDetail').innerHTML = '<p>게시글을 찾을 수 없습니다.</p>';
    }
}

// 좋아요 버튼 상태 업데이트
function updateLikeButton(post) {
    const likeButton = document.getElementById('likeButton');
    const likeCount = document.getElementById('likeCount');

    likeCount.textContent = post.likes.length;

    if (currentUser && post.likes.includes(currentUser.username)) {
        likeButton.classList.add('liked');
        likeButton.querySelector('i').classList.remove('far');
        likeButton.querySelector('i').classList.add('fas');
    } else {
        likeButton.classList.remove('liked');
        likeButton.querySelector('i').classList.remove('fas');
        likeButton.querySelector('i').classList.add('far');
    }
}

// 좋아요 토글
function toggleLike() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const post = posts.find(p => p.id === postId);

    if (post) {
        const likeIndex = post.likes.indexOf(currentUser.username);
        if (likeIndex === -1) {
            post.likes.push(currentUser.username);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        localStorage.setItem('communityPosts', JSON.stringify(posts));
        updateLikeButton(post);
    }
}

// 댓글 로드
function loadComments() {
    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    const commentsList = document.getElementById('commentsList');
    const commentCount = document.getElementById('commentCount');

    commentCount.textContent = comments.length;

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment-item" data-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${comment.date}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
            ${currentUser && currentUser.username === comment.author ? `
                <div class="comment-actions">
                    <button onclick="editComment(${comment.id})">수정</button>
                    <button onclick="deleteComment(${comment.id})">삭제</button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 댓글 작성
function addComment() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const commentInput = document.querySelector('.comment-input');
    const content = commentInput.value.trim();

    if (!content) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    const newComment = {
        id: Date.now(),
        author: currentUser.username,
        content: content,
        date: new Date().toLocaleDateString()
    };

    comments.push(newComment);
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));

    // 게시글의 댓글 수 업데이트
    const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments = (post.comments || 0) + 1;
        localStorage.setItem('communityPosts', JSON.stringify(posts));
    }

    commentInput.value = '';
    loadComments();
}

// 댓글 수정
function editComment(commentId) {
    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    const comment = comments.find(c => c.id === commentId);

    if (comment) {
        const modal = document.getElementById('editModal');
        const editInput = document.getElementById('editCommentInput');
        const saveButton = document.getElementById('saveEditButton');

        editInput.value = comment.content;
        modal.style.display = 'block';

        // 저장 버튼 클릭 이벤트
        saveButton.onclick = function () {
            const newContent = editInput.value.trim();

            if (!newContent) {
                alert('댓글 내용을 입력해주세요.');
                return;
            }

            comment.content = newContent;
            localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));

            modal.style.display = 'none';
            loadComments();
        };

        // 모달 닫기 버튼
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };

        // 모달 외부 클릭시 닫기
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }
}

// 댓글 삭제
function deleteComment(commentId) {
    if (confirm('댓글을 삭제하시겠습니까?')) {
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
        const commentIndex = comments.findIndex(c => c.id === commentId);

        if (commentIndex !== -1) {
            comments.splice(commentIndex, 1);
            localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));

            // 게시글의 댓글 수 업데이트
            const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
            const post = posts.find(p => p.id === postId);
            if (post) {
                post.comments = (post.comments || 0) - 1;
                localStorage.setItem('communityPosts', JSON.stringify(posts));
            }

            loadComments();
        }
    }
}

// 게시글 삭제
function deletePost() {
    if (confirm('게시글을 삭제하시겠습니까?')) {
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        const postIndex = posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
            posts.splice(postIndex, 1);
            localStorage.setItem('communityPosts', JSON.stringify(posts));

            // 댓글도 함께 삭제
            localStorage.removeItem(`comments_${postId}`);

            // 목록 페이지로 이동
            window.location.href = 'comunity.html';
        }
    }
}

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function () {
    getPostDetail();

    // 좋아요 버튼 클릭 이벤트
    document.getElementById('likeButton').addEventListener('click', toggleLike);

    // 댓글 작성 버튼 클릭 이벤트
    document.querySelector('.comment-submit').addEventListener('click', addComment);
});