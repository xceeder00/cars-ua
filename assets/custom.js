document.addEventListener('DOMContentLoaded', () => {
        const sliders = document.querySelectorAll('[data-scroll-custom]')
        sliders.forEach(slider => {
            if (!slider) return
            let isDown = false;
            let startX;
            let scrollLeft;
            let isDragging = false;  // Track if it's dragging
            
            // Get the slider's value to find matching scroll track
            const sliderValue = slider.getAttribute('data-scroll-custom');
            
            // Find the matching scroll track by value
            const scrollTrack = document.querySelector(`[data-scroll-track="${sliderValue}"]`);
            const scrollThumb = scrollTrack ? scrollTrack.querySelector('[data-scroll-thumb]') : null;
            
            // Initialize custom scrollbar
            function initCustomScrollbar() {
                if (!scrollTrack || !scrollThumb) return;
                
                // Calculate scrollbar dimensions
                function updateScrollbar() {
                    const scrollWidth = slider.scrollWidth;
                    const clientWidth = slider.clientWidth;
                    const maxScroll = scrollWidth - clientWidth;
                    
                    if (maxScroll <= 0) {
                        scrollTrack.style.display = 'none';
                        return;
                    }
                    
                    scrollTrack.style.display = 'block';
                    
                    // Calculate thumb width based on visible area
                    const thumbWidth = (clientWidth / scrollWidth) * 100;
                    scrollThumb.style.width = `${Math.max(thumbWidth, 10)}%`;
                    
                    // Calculate available track space for thumb movement
                    const trackWidth = scrollTrack.clientWidth;
                    const thumbWidthPx = (thumbWidth / 100) * trackWidth;
                    const availableSpace = trackWidth - thumbWidthPx;
                    
                    // Calculate thumb position - map scroll position to available space
                    const scrollPercent = slider.scrollLeft / maxScroll;
                    const thumbPosition = scrollPercent * availableSpace;
                    
                    scrollThumb.style.left = `${thumbPosition}px`;
                }
                
                // Update scrollbar on scroll
                slider.addEventListener('scroll', updateScrollbar);
                
                // Update scrollbar on resize
                window.addEventListener('resize', updateScrollbar);
                
                // Initial update
                updateScrollbar();
                
                // Handle scrollbar thumb dragging
                let isThumbDragging = false;
                let thumbStartX;
                let thumbStartScrollLeft;
                
                scrollThumb.addEventListener('mousedown', (e) => {
                    isThumbDragging = true;
                    thumbStartX = e.clientX;
                    thumbStartScrollLeft = slider.scrollLeft;
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                document.addEventListener('mousemove', (e) => {
                    if (!isThumbDragging) return;
                    
                    const deltaX = e.clientX - thumbStartX;
                    const trackWidth = scrollTrack.clientWidth;
                    const thumbWidth = scrollThumb.clientWidth;
                    const availableSpace = trackWidth - thumbWidth;
                    const maxScroll = slider.scrollWidth - slider.clientWidth;
                    
                    // Map thumb movement to scroll position
                    const scrollRatio = deltaX / availableSpace;
                    const newScrollLeft = thumbStartScrollLeft + (scrollRatio * maxScroll);
                    
                    // Clamp scroll position to valid range
                    slider.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
                });
                
                document.addEventListener('mouseup', () => {
                    isThumbDragging = false;
                });
                
                // Handle track clicking
                scrollTrack.addEventListener('click', (e) => {
                    if (e.target === scrollThumb) return;
                    
                    const trackRect = scrollTrack.getBoundingClientRect();
                    const clickX = e.clientX - trackRect.left;
                    const trackWidth = scrollTrack.clientWidth;
                    const thumbWidth = scrollThumb.clientWidth;
                    const availableSpace = trackWidth - thumbWidth;
                    const maxScroll = slider.scrollWidth - slider.clientWidth;
                    
                    // Calculate click position relative to available space
                    const clickPosition = Math.max(0, Math.min(clickX - thumbWidth / 2, availableSpace));
                    const scrollRatio = clickPosition / availableSpace;
                    
                    slider.scrollLeft = scrollRatio * maxScroll;
                });
            }
            
            // Initialize the custom scrollbar
            initCustomScrollbar();
            
            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
                isDragging = false;  // Reset dragging status
            });
            
            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.classList.remove('active');
                isDragging = false;  // Reset dragging status if mouse leaves
            });
            
            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.classList.remove('active');  // Remove active class on mouse up
            });
            
            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
            
                // Only start dragging if mouse has moved significantly
                if (Math.abs(walk) > 5) {
                    isDragging = true;  // It's a drag, not a click
                    slider.classList.add('active');  // Add active class on movement
                    slider.scrollLeft = scrollLeft - walk;
                }
            });
        })
       
        

    });    
