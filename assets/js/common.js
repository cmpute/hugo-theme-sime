(function () {
  initMobileMenu()
  initSubHeaders()
  initPrintHooks()

  /**
   * Mobile burger menu button and gesture for toggling sidebar
   */
  function initMobileMenu () {
    var mobileBar = document.getElementById('mobile-bar')
    var sidebar = document.querySelector('.sidebar')
    var menuButton = mobileBar.querySelector('.menu-button')

    menuButton.addEventListener('click', function () {
      sidebar.classList.toggle('open')
    })

    document.body.addEventListener('click', function (e) {
      if (e.target !== menuButton && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open')
      }
    })

    // Toggle sidebar on swipe
    var start = {}, end = {}

    document.body.addEventListener('touchstart', function (e) {
      start.x = e.changedTouches[0].clientX
      start.y = e.changedTouches[0].clientY
    })

    document.body.addEventListener('touchend', function (e) {
      end.y = e.changedTouches[0].clientY
      end.x = e.changedTouches[0].clientX

      var xDiff = end.x - start.x
      var yDiff = end.y - start.y

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0 && start.x <= 80) sidebar.classList.add('open')
        else sidebar.classList.remove('open')
      }
    })
  }

  /**
   * Initialize styles for sub headers in sidebar
   */
  function initSubHeaders () {
    var each = [].forEach
    var main = document.getElementById('main')
    var header = document.getElementById('header')
    var sidebar = document.querySelector('.sidebar')
    var content = document.querySelector('.content')
    var nav = document.querySelector('#TableOfContents')

    // set section-link class
    each.call(nav.querySelectorAll('a'), function (a) {
      a.classList.add('section-link')
    })

    var animating = false
    nav.addEventListener('click', function (e) {
      if (e.target.classList.contains('section-link')) {
        sidebar.classList.remove('open')
        setActive(e.target)
        animating = true
        setTimeout(function () {
          animating = false
        }, 600)
      }
    }, true)

    // gather headers
    var allHeaders = []
    var headers = content.querySelectorAll('h2')
    if (headers.length) {
      each.call(headers, function (h) {
        var h3s = collectH3s(h)
        allHeaders.push(h)
        allHeaders.push.apply(allHeaders, h3s)
      })
        
      console.log(allHeaders)
    } else {
      headers = content.querySelectorAll('h3')
      each.call(headers, function (h) {
        allHeaders.push(h)
      })
    }

    var hoveredOverSidebar = false
    sidebar.addEventListener('mouseover', function () {
      hoveredOverSidebar = true
    })
    sidebar.addEventListener('mouseleave', function () {
      hoveredOverSidebar = false
    })

    // listen for scroll event to do positioning & highlights
    if (allHeaders) {
      window.addEventListener('scroll', updateSidebar)
      window.addEventListener('resize', updateSidebar)
    }

    function updateSidebar () {
      var doc = document.documentElement
      var top = doc && doc.scrollTop || document.body.scrollTop
      if (animating) return
      var last = null
      for (var i = 0; i < allHeaders.length; i++) {
        var link = allHeaders[i]
        if (link.offsetTop > top) {
          if (!last) last = link
          break
        } else {
          last = link
        }
      }
      if (last)
        setActive(last.id)
    }

    function collectH3s (h) {
      var h3s = []
      var next = h.nextSibling
      while (next && next.tagName !== 'H2') {
        if (next.tagName === 'H3') {
          h3s.push(next)
        }
        next = next.nextSibling
      }
      return h3s
    }

    function setActive (id) {
      var previousActive = sidebar.querySelector('.section-link.active')
      var currentActive = typeof id === 'string'
        ? sidebar.querySelector('.section-link[href="#' + id + '"]')
        : id
      if (currentActive !== previousActive) {
        if (previousActive) previousActive.classList.remove('active')
        currentActive.classList.add('active')
      }
    }
  }

  /**
   * Automatically expand details when printing
   */
  function initPrintHooks() {
    window.addEventListener('beforeprint', function () {
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(details => {
        details.setAttribute('open', '');
      });
    });

    window.addEventListener('afterprint', function () {
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(details => {
        details.removeAttribute('open');
      });
    });
  }
})()
