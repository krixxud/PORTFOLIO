
const POSTS_PER_PAGE = 6;
let currentPage = 1;

// 페이지네이션 HTML 생성 함수
function createPaginationHTML(totalPosts, currentPage) {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    let paginationHTML = '<div class="pagination">';
    
    // 이전 페이지 버튼
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="page-btn">이전</button>`;
    }
    
    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button onclick="changePage(${i})" 
                    class="page-btn ${currentPage === i ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    // 다음 페이지 버튼
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="page-btn">다음</button>`;
    }
    
    paginationHTML += '</div>';
    return paginationHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const postGrid = document.querySelector('.post-grid');
    let currentCategory = 'all'; // 현재 선택된 카테고리 저장
    
    // localStorage에서 게시글 불러오기
    function loadPosts() {
        const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]');
        
        // 카테고리 필터링
        const filteredPosts = currentCategory === 'all' 
            ? posts 
            : posts.filter(post => post.category === currentCategory);
        
        // 기존 게시글 제거
        postGrid.innerHTML = '';
        
        // 페이지네이션을 위한 시작/끝 인덱스 계산
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        
        // 현재 페이지에 해당하는 게시글만 표시
        filteredPosts.slice(startIndex, endIndex).forEach(post => {
            const postCard = document.createElement('div');
            postCard.classList.add('post-card');
            postCard.innerHTML = `
                <div class="post-content">
                    <div class="post-category">${getCategoryName(post.category)}</div>
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-info">
                        <span class="post-author">작성자: ${post.author}</span>
                        <div class="post-meta">
                            <span><i class="far fa-eye"></i>${post.views || 0}</span>
                            <span><i class="far fa-comment"></i>${post.comments || 0}</span>
                        </div>
                    </div>
                </div>
            `;
            
            postCard.addEventListener('click', () => {
                window.location.href = `post.html?id=${post.id}`;
            });
            
            postGrid.appendChild(postCard);
        });
        
        // 페이지네이션 추가
        const paginationContainer = document.querySelector('.pagination-container') || 
            document.createElement('div');
        paginationContainer.className = 'pagination-container';
        paginationContainer.innerHTML = createPaginationHTML(filteredPosts.length, currentPage);
        
        if (!document.querySelector('.pagination-container')) {
            postGrid.parentNode.insertBefore(paginationContainer, postGrid.nextSibling);
        }
    }
    
    // 카테고리 이름 변환
    function getCategoryName(category) {
        const categoryMap = {
            'qna': 'Q&A',
            'interior': '이사/인테리어',
            'review': '매매후기'
        };
        return categoryMap[category] || category;
    }
    
    // 페이지 변경 함수
    window.changePage = function(page) {
        currentPage = page;
        loadPosts();
    }
    
    // 초기 게시글 로드
    loadPosts();
    
    // 카테고리 탭 이벤트
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 기존 활성화된 탭의 클래스 제거
            categoryTabs.forEach(t => t.classList.remove('active'));
            // 클릭된 탭 활성화
            tab.classList.add('active');
            
            // 선택된 카테고리 값 가져오기
            currentCategory = tab.dataset.category;
            
            // 페이지 초기화 및 게시글 다시 로드
            currentPage = 1;
            loadPosts();
        });
    });
});

// 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .post-card {
        cursor: pointer;
        transition: transform 0.2s ease;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 16px;
        padding: 16px;
    }
    
    .post-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    
    .pagination {
        display: flex;
        gap: 8px;
    }
    
    .page-btn {
        padding: 8px 12px;
        border: 1px solid #ddd;
        background-color: white;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .page-btn.active {
        background-color: #E7C49C;
        color: white;
        border-color: #E7C49C;
    }
    
    .page-btn:hover:not(.active) {
        background-color: #f5f5f5;
    }
`;
document.head.appendChild(style);