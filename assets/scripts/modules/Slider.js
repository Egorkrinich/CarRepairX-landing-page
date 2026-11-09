export default class Slider {
    handlers = {
        onPointerMove: (e) => {
            this.scrub(e.clientX)
        },
    }
    constructor(attrValue, settings) {
        this.container = document.querySelector(`[data-slider="${attrValue}"]`);
        this.track     = this.container.querySelector(`[data-slider-el="track"]`);
        this.control   = this.container.querySelector(`[data-slider-el="control"]`);

        this.trackStyles = null

        
        this.status = {
            currentIndex: 0
        }
        
        this.settings = null;
        this.breakpoints = settings.breakpoints ?? null;


        this.dragStart = null;
        this.trackRect = null;


        this.init(settings)
        this.initListeners();
        this.updateResponsive();
        this.applySettings();
    }
    init(settings) {
        this.settings = Object.entries(settings).reduce((acc, [key, value]) => {
            if (typeof value !== 'object') {
              acc[key] = value;
            }
            return acc;
        }, {});


        this.trackStyles = window.getComputedStyle(this.track)
        this.updateSliderGap(this.trackStyles.gap)

        this.status.totalSlides = this.track.querySelectorAll(`.slider__slide`).length
        this.updateMaxIndex()
    }
    initListeners() {
        window.addEventListener('resize', () => this.updateResponsive())

        this.control.addEventListener('click', (e) => {
            const btn = e.target.closest(`[data-slider-btn]`);
            if (!btn) return;
            const direction = btn.getAttribute(`data-slider-btn`);
            if (direction === 'next') {
                this.nextSlide()
            } else {
                this.prevSlide()
            }
        })
        this.track.addEventListener('pointerdown', (e) => {
            if (!this.trackRect) {
                this.trackRect = this.track.getBoundingClientRect()
            }
            this.dragStart = e.clientX - this.trackRect.left
            
            window.addEventListener('pointermove', this.handlers.onPointerMove)

            window.addEventListener('pointerup', (e) => {
                window.removeEventListener('pointermove', this.handlers.onPointerMove)
                this.track.classList.remove('is-dragging')

                const dragEnd = e.clientX - this.trackRect.left;
                const dragDistance = dragEnd - this.dragStart
                this.dragStart = null

                const swipeThreshold = this.trackRect.width / 4
                if (dragDistance < -swipeThreshold) {
                    this.nextSlide()
                } else if (dragDistance > swipeThreshold) {
                    this.prevSlide()
                } else {
                    this.toSlide(this.status.currentIndex)
                }
            }, {once: true})
        })
    }


    scrub(clientX) {
        const currentOffset = 100 * this.status.currentIndex;

        const dragCurrent = clientX - this.trackRect.left
        
        const dragDistance = dragCurrent - this.dragStart


        const gapOffset = this.status.gap * this.status.currentIndex
        this.track.style.transform = 
        `translateX(calc(-${currentOffset}% - ${gapOffset}px + ${dragDistance}px))`
        this.track.classList.add('is-dragging')
        
    }
    nextSlide() {
        this.status.currentIndex++
        
        if (this.status.currentIndex > this.status.maxIndex) {
            this.status.currentIndex = 0;
            this.track.style.transform = 'translateX(0)';
            return
        }

        const offset = 100 * this.status.currentIndex 
        const gapOffset = this.status.gap * this.status.currentIndex
        
        this.track.style.transform = `translateX(calc(-${offset}% - ${gapOffset}px))`;
    }
    prevSlide() {
        this.status.currentIndex--

        if (this.status.currentIndex < 0) {
            this.status.currentIndex = this.status.maxIndex - 1;
            this.nextSlide()
            return
        }
        const offset = 100 * this.status.currentIndex;
        let gapOffset = 0
        if (this.status.currentIndex !== 0) {
            gapOffset = this.status.gap * this.status.currentIndex
        }
        
        this.track.style.transform = `translateX(calc(-${offset}% - ${gapOffset}px))`;
    }
    toSlide(index) {
        const offset = 100 * index;
        const gapOffset = this.status.gap * index;
        this.track.style.transform = `translateX(calc(-${offset}% - ${gapOffset}px))`;
    }



    updateResponsive() {
        if (!this.breakpoints) return;

        if (this.status.gap !== this.trackStyles.gap) {
            this.updateSliderGap(this.trackStyles.gap)
            this.toSlide(this.status.currentIndex)
        }

        const currentWidth = window.innerWidth;
        const clearBreakpoints = Object.keys(this.breakpoints)
        .map(Number).sort((a, b) => a - b)

        let newSettings = {};
        for (const breakpoint of clearBreakpoints) {
            if (currentWidth >= breakpoint) {
                newSettings = this.breakpoints[breakpoint]
            }
        }
        if (Object.keys(newSettings).length > 0 ) {
            this.settings = {...this.settings, ...newSettings}
        }
        this.applySettings()
    }
    applySettings() {
        Object.entries(this.settings).forEach(([key, value]) => {
            switch (key) {
                case 'slidesPerView':
                    this.updateMaxIndex()
                    if (value === 1) {
                        this.setFlexBasis(`100%`)
                    } else if (value > 1) {
                        const slideWidth = 100 / value
                        this.setFlexBasis(`calc(${slideWidth}% - (var(--slider-gap) / 2))`);
                    }
                break;
            }
        })

    }

    setFlexBasis(value) {
        this.container.style.setProperty('--slide-flex-basis', value)
    }
    updateSliderGap(gap) {
        this.status.gap = parseFloat(gap) || 0
        this.container.style.setProperty('--slider-gap', `${this.status.gap}px`)
    }
    updateMaxIndex() {
        this.status.maxIndex = Math.ceil(this.status.totalSlides / this.settings.slidesPerView) - 1
    }
}   