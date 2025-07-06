document.addEventListener("DOMContentLoaded", () => {
  const langKoBtn = document.getElementById("lang-ko")
  const langViBtn = document.getElementById("lang-vi")

  let currentLang = localStorage.getItem("language") || "ko"

  setLanguage(currentLang)

  langKoBtn.addEventListener("click", () => {
    setLanguage("ko")
    localStorage.setItem("language", "ko")
  })

  langViBtn.addEventListener("click", () => {
    setLanguage("vi")
    localStorage.setItem("language", "vi")
  })

  function setLanguage(lang) {
    currentLang = lang

    langKoBtn.classList.toggle("active", lang === "ko")
    langViBtn.classList.toggle("active", lang === "vi")

    document.documentElement.lang = lang === "ko" ? "ko" : "vi"

    const elements = document.querySelectorAll("[data-ko][data-vi]")
    elements.forEach((element) => {
      const text = element.getAttribute(`data-${lang}`)
      if (text) {
        element.textContent = text
      }
    })

    const titles = {
      ko: "호치민 데이트 플랜 - 전문 여행 가이드",
      vi: "Kế hoạch hẹn hò tại TP.HCM - Hướng dẫn du lịch chuyên nghiệp",
    }
    document.title = titles[lang]
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  document.querySelectorAll(".map-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const originalText = this.querySelector("span:last-child").textContent
      const loadingText = currentLang === "ko" ? "로딩 중..." : "Đang tải..."

      this.querySelector("span:last-child").textContent = loadingText
      this.style.opacity = "0.7"

      setTimeout(() => {
        this.querySelector("span:last-child").textContent = originalText
        this.style.opacity = "1"
      }, 1000)
    })
  })

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  document.querySelectorAll(".course-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })

  document.querySelectorAll(".activity").forEach((activity) => {
    activity.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.02)"
    })

    activity.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
    })
  })

  document.querySelectorAll(".map-btn, .lang-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
})

const style = document.createElement("style")
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .map-btn, .lang-btn {
        position: relative;
        overflow: hidden;
    }
`
document.head.appendChild(style)
