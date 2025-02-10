// 전역 변수로 필터 상태 관리
let activeFilters = {
    type: 'all',
    area: 'all',
    price: 'all',
    size: 'all',
    rooms: 'all'
};

// 페이지네이션 변수
let currentPage = 1;
const itemsPerPage = 9;

// 가격 범위 변환 함수
function getPriceRange(priceText) {
    const price = parseFloat(priceText);
    if (price <= 5) return '5억 이하';
    if (price <= 10) return '5억-10억';
    return '10억 이상';
}

// 면적 범위 변환 함수 (제곱미터 -> 평)
function getSizeRange(sizeText) {
    // 제곱미터를 평으로 변환 (1평 = 3.3058㎡)
    const sizeM2 = parseFloat(sizeText);
    const sizePyeong = sizeM2 / 3.3058;
    
    if (sizePyeong <= 30) return '30평 이하';
    if (sizePyeong <= 50) return '30-50평';
    return '50평 이상';
}

// 방 개수 범위 변환 함수
function getRoomRange(rooms) {
    if (rooms <= 2) return '1-2룸';
    if (rooms <= 4) return '3-4룸';
    return '5룸 이상';
}

// 필터링된 아이템 가져오기
function getFilteredItems() {
    return Array.from(document.querySelectorAll('.grid-item')).filter(item => {
        // 각 속성 가져오기
        const type = item.getAttribute('data-type');
        const location = item.querySelector('.property-location span').textContent;
        const priceText = item.querySelector('.price').textContent;
        const sizeText = item.querySelector('.detail-value').textContent;
        
        // 주거 유형 체크
        if (activeFilters.type !== 'all' && type !== activeFilters.type) {
            return false;
        }

        // 지역 체크
        if (activeFilters.area !== 'all') {
            const area = activeFilters.area.replace('구', '').trim();
            if (!location.includes(area)) {
                return false;
            }
        }

        // 가격 체크
        if (activeFilters.price !== 'all') {
            const itemPriceRange = getPriceRange(priceText);
            if (itemPriceRange !== activeFilters.price) {
                return false;
            }
        }

        // 면적 체크
        if (activeFilters.size !== 'all') {
            const itemSizeRange = getSizeRange(sizeText);
            if (itemSizeRange !== activeFilters.size) {
                return false;
            }
        }

        // 기본적으로 모든 조건을 통과하면 표시
        return true;
    });
}

// 필터 버튼 클릭 이벤트 핸들러
document.querySelectorAll('.filter-buttons button').forEach(button => {
    button.addEventListener('click', function() {
        const filterSection = this.closest('.filter-section');
        const filterType = filterSection.querySelector('h3').textContent;
        const value = this.textContent;

        // 같은 섹션의 다른 버튼들 비활성화
        filterSection.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');

        // 필터 상태 업데이트
        switch(filterType) {
            case '주거 유형':
                activeFilters.type = value === '전체' ? 'all' : value;
                break;
            case '지역':
                activeFilters.area = value === '전체' ? 'all' : value;
                break;
            case '가격대':
                activeFilters.price = value === '전체' ? 'all' : value;
                break;
            case '면적':
                activeFilters.size = value === '전체' ? 'all' : value;
                break;
            case '방 개수':
                activeFilters.rooms = value === '전체' ? 'all' : value;
                break;
        }

        // 필터 변경시 첫 페이지로 돌아가고 결과 표시
        currentPage = 1;
        showFilteredItems();
    });
});

// 필터링된 아이템 표시
function showFilteredItems() {
    const filteredItems = getFilteredItems();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 모든 아이템 숨기기
    document.querySelectorAll('.grid-item').forEach(item => {
        item.style.display = 'none';
    });

    // 현재 페이지에 해당하는 필터링된 아이템만 표시
    filteredItems.slice(startIndex, endIndex).forEach(item => {
        item.style.display = 'block';
    });

    updatePagination(filteredItems.length);
}

// 페이지네이션 업데이트
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // 현재 페이지가 마지막 페이지보다 크면 조정
    if (currentPage > totalPages) {
        currentPage = totalPages || 1;
    }

    // 페이지 버튼 생성
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('page-number');
        button.textContent = i;
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            showFilteredItems();
        });
        pageNumbers.appendChild(button);
    }

    // 이전/다음 버튼 상태 업데이트
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// 이전/다음 페이지 버튼 이벤트
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showFilteredItems();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const filteredItems = getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        showFilteredItems();
    }
});

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    showFilteredItems();
});