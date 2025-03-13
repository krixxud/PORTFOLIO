        // 문의하기 버튼 이벤트
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseover', function () {
                this.style.opacity = '0.9';
            });
            button.addEventListener('mouseout', function () {
                this.style.opacity = '1';
            });
        });

        // 이미지 갤러리 기능 (추가 예정)
        const propertyImages = document.querySelector('.property-images');
        if (propertyImages) {
            propertyImages.addEventListener('click', function () {
                // 이미지 갤러리 열기 기능
                console.log('이미지 갤러리 열기');
            });
        }

        // 카카오맵 초기화
        var mapContainer = document.getElementById('map');
        var mapOption = {
            center: new kakao.maps.LatLng(37.508838, 127.062405), // 래미안 퍼스트하이 위치의 위도, 경도
            level: 3 // 지도의 확대 레벨
        };

        // 지도 생성
        var map = new kakao.maps.Map(mapContainer, mapOption);

        // 마커 위치 설정
        var markerPosition = new kakao.maps.LatLng(37.508838, 127.062405);

        // 마커 생성
        var marker = new kakao.maps.Marker({
            position: markerPosition
        });

        // 마커를 지도에 표시
        marker.setMap(map);

        // 커스텀 오버레이 내용
        var content = '<div class="custom-overlay" style="padding: 5px 10px; background: white; border-radius: 5px; border: 1px solid #E7C49C;">' +
            '<span style="color: #333; font-weight: bold;">래미안 퍼스트하이</span>' +
            '</div>';

        // 커스텀 오버레이 생성
        var customOverlay = new kakao.maps.CustomOverlay({
            position: markerPosition,
            content: content,
            yAnchor: 2.2
        });

        // 커스텀 오버레이를 지도에 표시
        customOverlay.setMap(map);

        // 주변 시설 데이터
        const facilities = [
            {
                position: new kakao.maps.LatLng(37.509838, 127.063405),
                title: '삼성중앙역',
                type: '지하철역',
                distance: '도보 5분',
                icon: 'subway'
            },
            {
                position: new kakao.maps.LatLng(37.507838, 127.061405),
                title: '삼성초등학교',
                type: '교육시설',
                distance: '도보 10분',
                icon: 'school'
            },
            {
                position: new kakao.maps.LatLng(37.508338, 127.064405),
                title: '이마트',
                type: '대형마트',
                distance: '도보 8분',
                icon: 'shopping-cart'
            },
            {
                position: new kakao.maps.LatLng(37.507338, 127.060405),
                title: '삼성병원',
                type: '병원',
                distance: '도보 15분',
                icon: 'hospital'
            }
        ];

        // 현재 열린 정보창을 추적하기 위한 변수
        let currentInfowindow = null;

        // 마커 이미지 생성 함수
        function createMarkerImage(icon) {
            return `<div class="facility-marker" style="cursor: pointer;">
        <i class="fas fa-${icon}" style="color: #ffffff; font-size: 20px;"></i>
    </div>`;
        }

        // 정보창 내용 생성 함수
        function createInfoWindowContent(facility) {
            return `
        <div class="facility-info" style="padding: 15px; min-width: 200px; background: white; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
                <i class="fas fa-${facility.icon}" style="color: #3A86FF; margin-right: 8px;"></i>
                ${facility.title}
            </h4>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
                <span style="color: #3A86FF;">▪</span> 분류: ${facility.type}<br>
                <span style="color: #3A86FF;">▪</span> 거리: ${facility.distance}
            </p>
        </div>
    `;
        }

        // CSS 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
    .facility-marker {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background: #3A86FF;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        transition: transform 0.2s;
    }
    .facility-marker:hover {
        transform: scale(1.1);
    }
`;
        document.head.appendChild(style);

        // 마커와 정보창 생성 및 이벤트 설정
        facilities.forEach(facility => {
            // 마커 엘리먼트 생성
            const markerContent = createMarkerImage(facility.icon);

            // 마커 생성
            const marker = new kakao.maps.CustomOverlay({
                position: facility.position,
                content: markerContent,
                map: map
            });

            // 정보창 생성
            const infowindow = new kakao.maps.CustomOverlay({
                position: facility.position,
                content: createInfoWindowContent(facility),
                xAnchor: 0.5,
                yAnchor: 1.5,
                zIndex: 1
            });

            // 마커 엘리먼트에 클릭 이벤트 추가
            marker.setMap(map);
            const markerElement = marker.getContent();

            // 클릭 이벤트를 div 엘리먼트에 직접 추가
            setTimeout(() => {
                const markerDivs = document.querySelectorAll('.facility-marker');
                markerDivs.forEach(markerDiv => {
                    markerDiv.addEventListener('click', function () {
                        // 이전 정보창 닫기
                        if (currentInfowindow) {
                            currentInfowindow.setMap(null);
                        }
                    });
                });
            }, 100);
        });

        // 지도 클릭 시 정보창 닫기
        kakao.maps.event.addListener(map, 'click', function () {
            if (currentInfowindow) {
                currentInfowindow.setMap(null);
                currentInfowindow = null;
            }
        });

        // 모든 마커가 보이도록 지도 범위 재설정
        const bounds = new kakao.maps.LatLngBounds();
        facilities.forEach(facility => {
            bounds.extend(facility.position);
        });
        map.setBounds(bounds);