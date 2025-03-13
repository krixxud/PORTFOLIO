// Intersection Observer를 사용하여 요소가 화면에 보이는지 감지
const observerOptions = {
    threshold: 0.8 // 80% 이상 보일 때 실행
};

let hasAnimated = false; // 애니메이션이 한 번만 실행되도록 하는 플래그

const statsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            entry.target.classList.add('visible');
            startCounting();
            hasAnimated = true;
            observer.unobserve(entry.target); // 한 번 실행 후 관찰 중단
        }
    });
}, observerOptions);

// stats 섹션 관찰 시작
const statsSection = document.querySelector('.stats-section');
statsSection.classList.remove('visible');
statsObserver.observe(statsSection);

function startCounting() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(numberElement => {
        const target = parseInt(numberElement.dataset.target);
        const suffix = numberElement.dataset.suffix || '';
        const duration = 2000; // 애니메이션 지속 시간 (2초)
        const steps = 50; // 업데이트 횟수
        const stepDuration = duration / steps;
        let current = 0;

        // 큰 숫자는 더 큰 단계로 증가
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // 소수점 처리: 타겟 값이 100 미만이면 소수점 1자리까지 표시
            const displayNumber = target < 100 ?
                Math.round(current * 10) / 10 :
                Math.round(current);

            numberElement.textContent = displayNumber + suffix;
        }, stepDuration);
    });
}