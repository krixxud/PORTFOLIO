// 카카오맵 초기화
var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.503282, 127.007417), // 반포 자이 위치의 위도, 경도
    level: 3 // 지도의 확대 레벨
};
var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커 위치 설정
var markerPosition = new kakao.maps.LatLng(37.503282, 127.007417);

// 마커 생성
var marker = new kakao.maps.Marker({
    position: markerPosition
});

marker.setMap(map);

// 커스텀 오버레이 내용
var content = '<div class="custom-overlay" style="padding: 5px 10px; background: white; border-radius: 5px; border: 1px solid #E7C49C;">' +
    '<span style="color: #333; font-weight: bold;">반포 자이</span>' +
    '</div>';

// 커스텀 오버레이 생성
var customOverlay = new kakao.maps.CustomOverlay({
    position: markerPosition,
    content: content,
    yAnchor: 2.2
});

// 커스텀 오버레이를 지도에 표시
customOverlay.setMap(map);