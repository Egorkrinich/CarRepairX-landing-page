function initHeaderSentinel() {
    const header = document.getElementById('header')
    const sentinel = document.querySelector('#header-sentinel')

    const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) {
        header.classList.add('header--scrolled')
    } else {
        header.classList.remove('header--scrolled')
    }
    }, {
      threshold: [0]
    })
    observer.observe(sentinel)
}
initHeaderSentinel()