        // 모든 매물 데이터를 객체 배열로 저장
        const propertyData = [
            {
                title: "래미안 퍼스트하이",
                price: "8.5억",
                location: "서울시 강남구",
                area: "84㎡ (25.4평)",
                type: "전세",
                link: "./productSub.html"
            },
            {
                title: "반포 자이",
                price: "15억",
                location: "서울시 서초구",
                area: "115㎡ (34.8평)",
                type: "매매",
                link: "./banpo.html"
            },
            // ... 다른 모든 매물 데이터 추가
        ];

        // 검색어 자동완성 및 직접 이동 기능 구현
        function initializeSearchAutocomplete() {
            const searchInput = document.querySelector('input[type="search"]');
            const searchContainer = document.querySelector('.search-container');

            // 자동완성 결과를 표시할 div 생성
            const autocompleteDiv = document.createElement('div');
            autocompleteDiv.className = 'autocomplete-results';
            autocompleteDiv.style.display = 'none';
            searchContainer.appendChild(autocompleteDiv);

            // 스타일 추가
            const style = document.createElement('style');
            style.textContent = `
        .autocomplete-results {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            right: 0;
            background: white;
            border: 1px solid #ddd;
            width: 80%;
            border-radius: 0 0 4px 4px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .autocomplete-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .autocomplete-item:hover {
            background-color: #f5f5f5;
        }
        .property-info-preview {
            flex-grow: 1;
        }
        .property-title {
            font-weight: bold;
            color: #333;
            padding: 1rem 0rem;
        }
        .property-details {
            font-size: 0.9em;
            color: #666;
            padding: 1rem 1rem;
            width: 100%;
        }
    `;
            document.head.appendChild(style);

            // 검색어 입력 시 자동완성 결과 표시
            searchInput.addEventListener('input', function (e) {
                const searchTerm = e.target.value.toLowerCase();

                if (searchTerm.length < 2) {
                    autocompleteDiv.style.display = 'none';
                    return;
                }

                // 검색어와 일치하는 매물 찾기
                const matches = propertyData.filter(property =>
                    property.title.toLowerCase().includes(searchTerm) ||
                    property.location.toLowerCase().includes(searchTerm)
                );

                // 검색 결과 표시
                if (matches.length > 0) {
                    autocompleteDiv.innerHTML = matches.map(property => `
                <div class="autocomplete-item" data-link="${property.link}">
                    <div class="property-info-preview">
                        <div class="property-title">${property.title}</div>
                        <div class="property-details">
                            ${property.location} | ${property.type} | ${property.price}
                        </div>
                    </div>
                </div>
            `).join('');
                    autocompleteDiv.style.display = 'block';
                } else {
                    autocompleteDiv.style.display = 'none';
                }
            });

            // 검색어로 매물 찾기 함수
            function findMatchingProperties(searchTerm) {
                return propertyData.filter(property =>
                    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    property.location.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // 첫 번째 일치하는 매물로 이동하는 함수
            function navigateToFirstMatch(searchTerm) {
                const matches = findMatchingProperties(searchTerm);
                if (matches.length > 0) {
                    window.location.href = matches[0].link;
                } else {
                    showToast('일치하는 매물이 없습니다.');
                }
            }

            // Enter 키 입력 처리
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const searchTerm = this.value.trim();
                    if (searchTerm.length >= 2) {
                        navigateToFirstMatch(searchTerm);
                    } else {
                        showToast('검색어를 2글자 이상 입력해주세요.');
                    }
                }
            });

            // 자동완성 결과 클릭 시 해당 매물 페이지로 이동
            autocompleteDiv.addEventListener('click', function (e) {
                const item = e.target.closest('.autocomplete-item');
                if (item) {
                    window.location.href = item.dataset.link;
                }
            });

            // 검색창 외부 클릭 시 자동완성 결과 숨기기
            document.addEventListener('click', function (e) {
                if (!searchContainer.contains(e.target)) {
                    autocompleteDiv.style.display = 'none';
                }
            });
        }

        // DOM 로드 완료 후 검색 기능 초기화
        document.addEventListener('DOMContentLoaded', function () {
            initializeSearchAutocomplete();
        });

        // DOM 로드 완료 후 실행
        document.addEventListener('DOMContentLoaded', function () {
            // 탭 기능 구현
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // 모든 탭 버튼에서 active 클래스 제거
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // 클릭된 탭 버튼에 active 클래스 추가
                    button.classList.add('active');

                    // 모든 탭 컨텐츠 숨기기
                    tabContents.forEach(content => content.classList.remove('active'));
                    // 선택된 탭의 컨텐츠 표시
                    const tabId = button.getAttribute('data-tab');
                    document.getElementById(tabId)?.classList.add('active');
                });
            });

            // 찜하기 기능 구현
            const likeButtons = document.querySelectorAll('.like-btn');
            likeButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const icon = button.querySelector('i');
                    if (icon.classList.contains('far')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        showToast('찜 목록에 추가되었습니다.');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        showToast('찜 목록에서 제거되었습니다.');
                    }
                });
            });

            // 상세정보 버튼 기능
            const detailButtons = document.querySelectorAll('.view-detail-btn');
            detailButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const propertyCard = button.closest('.property-card');
                    const propertyTitle = propertyCard.querySelector('.property-title').textContent;
                    // 실제 구현시에는 해당 매물의 상세 페이지로 이동
                    window.location.href = `./product.html?property=${encodeURIComponent(propertyTitle)}`;
                });
            });
        });