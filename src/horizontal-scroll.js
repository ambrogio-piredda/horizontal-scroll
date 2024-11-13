class HorizontalScroll {
  #wrapper
  #container
  #prev
  #next
  #prevIcon
  #nextIcon
  #breakpoint
  #resizeTimeout

	/**
	 * Create the constructor object
	 * @param {HTML Element} container The container of the items
	 * @param {Object} options Options and settings
	 */
  constructor(container, options = {}) {
    // Combine user options with defaults
    const {
      prevIcon,
      nextIcon,
      breakpoint
    } = Object.assign({
        prevIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                  </svg>`,
        nextIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                  </svg>`,
        breakpoint: null
    }, options)

    // Define properties
    this.#wrapper = document.createElement('div')
    this.#container = document.querySelector(container)
    this.#prev = document.createElement('button')
    this.#next = document.createElement('button')
    this.#prevIcon = prevIcon
    this.#nextIcon = nextIcon
    this.#breakpoint = breakpoint

    this.#setup()
  }

	/**
	 * Setup HTML structure, classes, and events
	 */
  #setup() {
    this.#wrapper.classList.add('horizontal-scroll')
    this.#container.classList.add('horizontal-scroll-container')
    this.#prev.classList.add('horizontal-scroll-button')
    this.#next.classList.add('horizontal-scroll-button')
    this.#prev.innerHTML = this.#prevIcon
    this.#next.innerHTML = this.#nextIcon

    // Add wrapper before container
    this.#container.parentElement.insertBefore(this.#wrapper, this.#container)

    // Add container to wrapper
    this.#wrapper.appendChild(this.#container)

    this.#prev.addEventListener('click', this.#scrollToPrev.bind(this))
    this.#next.addEventListener('click', this.#scrollToNext.bind(this))

    this.#update()

    window.addEventListener('resize', () => {
      // clearTimeOut() resets the setTimeOut() timer
      // due to this the function in setTimeout() is
      // fired only after resizing is ended
      clearTimeout(this.#resizeTimeout)

      // setTimeout returns the numeric ID, which is used by
      // clearTimeout to reset the timer
      this.#resizeTimeout = setTimeout(this.#update.bind(this), 600)
    })

    this.#container.addEventListener('scrollend', this.#enabler.bind(this))
  }

	/**
	 * Update HTML structure
	 */
  #update() {
    if (this.#isOverflowing()) {

      if (this.#breakpoint && window.innerWidth < this.#breakpoint) {
        this.#clear()
      }

      this.#scroll(0)

      // Add prev button
      this.#wrapper.insertBefore(this.#prev, this.#container)

      // Add next button
      this.#wrapper.appendChild(this.#next)

      this.#enabler()

    } else {

      this.#clear()
    }
  }

	/**
	 * Determine if itmes take up more space (in length) than their container
	 */
  #isOverflowing() {
    return this.#container.scrollWidth > this.#container.offsetWidth
  }

	/**
	 * Scroll towards previous items
	 */
  #scrollToPrev() {
    // How much scrolled minus half of visible width
    const left = this.#container.scrollLeft - (this.#container.offsetWidth / 2)

    this.#scroll(left)
  }

	/**
	 * Scroll towards next items
	 */
  #scrollToNext() {
    // How much scrolled plus half of visible width
    const left = this.#container.scrollLeft + (this.#container.offsetWidth / 2)

    this.#scroll(left)
  }

	/**
	 * Scroll to a specific position
	 * @param {Number} left Left position in pixels
	 */
  #scroll(left) {
     this.#container.scroll({
       top: 0,
       left: left,
       behavior: 'smooth'
     })
  }

	/**
	 * Remove buttons
	 */
  #clear() {
    this.#prev.remove()
    this.#next.remove()
  }

	/**
	 * Determine buttons status (enabled/disabled)
	 */
  #enabler() {
    // Remove disabled attribute to start with (if present)
    this.#prev.removeAttribute('disabled')
    this.#next.removeAttribute('disabled')

    // If at the beginning of the scrolling seciton, disable the prev button
    if (this.#container.scrollLeft === 0) {
      this.#prev.setAttribute('disabled', '')
    }

    // If at the end of the scrolling seciton, disable the next button
    if ((this.#container.scrollLeft + this.#container.offsetWidth) === this.#container.scrollWidth) {
      this.#next.setAttribute('disabled', '')
    }
  }
}
