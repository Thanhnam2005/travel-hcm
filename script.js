    let currentPopupLanguage = "ko"
    let popupShown = false

    const popupContent = {
      ko: {
        title: "호치민 데이트 플랜에 오신 것을 환영합니다! 🎉",
        subtitle: "결혼의 여신과 함께하는 특별한 여행",
        description: "8개의 완벽하게 큐레이션된 데이트 코스로 호치민에서 잊지 못할 추억을 만들어보세요.",
        features: ["전문적으로 선별된 8개 코스", "상세한 시간표와 위치 정보", "현지 맛집 추천", "한국어-베트남어 지원"],
        startButton: "여행 시작하기",
        closeButton: "닫기",
        brandName: "결혼의 여신",
        brandSubtitle: "호치민 여행 가이드",
      },
      vi: {
        title: "Chào mừng đến với Kế hoạch hẹn hò TP.HCM! 🎉",
        subtitle: "Chuyến du lịch đặc biệt cùng Hôn Nhân Quốc Tế",
        description: "8 lộ trình hẹn hò được tuyển chọn hoàn hảo để tạo nên những kỷ niệm khó quên tại TP.HCM.",
        features: [
          "8 lộ trình được chọn lọc chuyên nghiệp",
          "Thông tin thời gian và địa điểm chi tiết",
          "Gợi ý nhà hàng địa phương",
          "Hỗ trợ tiếng Hàn - tiếng Việt",
        ],
        startButton: "Bắt đầu du lịch",
        closeButton: "Đóng",
        brandName: "Hôn Nhân Quốc Tế",
        brandSubtitle: "Hướng dẫn du lịch TP.HCM",
      },
    }
    document.addEventListener("DOMContentLoaded", () => {
      if (!sessionStorage.getItem("popupShown")) {
        setTimeout(showPopup, 1500)
      }
    })

    function showPopup() {
      const popup = document.getElementById("welcomePopup")
      if (popup) {
        popup.classList.add("show")
        popupShown = true
        sessionStorage.setItem("popupShown", "true")
        document.body.style.overflow = "hidden"
      }
    }
    function closePopup() {
      const popup = document.getElementById("welcomePopup")
      if (popup) {
        popup.classList.remove("show")
        document.body.style.overflow = ""
      }
    }
    function startTour() {
      closePopup()
      const coursesSection = document.querySelector(".courses-grid")
      if (coursesSection) {
        coursesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
    function switchPopupLanguage(lang) {
      currentPopupLanguage = lang
      const langButtons = document.querySelectorAll(".popup-lang-btn")
      langButtons.forEach((btn) => {
        btn.classList.remove("active")
      })
      const activeLangBtn = document.querySelector(`[onclick="switchPopupLanguage('${lang}')"]`)
      if (activeLangBtn) {
        activeLangBtn.classList.add("active")
      }
      updatePopupContent(lang)
    }
    function updatePopupContent(lang) {
      const elements = document.querySelectorAll("#welcomePopup [data-ko][data-vi]")

      elements.forEach((element) => {
        const text = element.getAttribute(`data-${lang}`)
        if (text) {
          element.textContent = text
        }
      })
      const featureTexts = document.querySelectorAll(".popup-feature-text")
      featureTexts.forEach((element, index) => {
        if (popupContent[lang].features[index]) {
          element.textContent = popupContent[lang].features[index]
        }
      })
    }
    document.addEventListener("click", (event) => {
      const popup = document.getElementById("welcomePopup")
      const popupContainer = document.querySelector(".popup-container")

      if (popup && popup.classList.contains("show")) {
        if (event.target === popup && !popupContainer.contains(event.target)) {
          closePopup()
        }
      }
    })
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const popup = document.getElementById("welcomePopup")
        if (popup && popup.classList.contains("show")) {
          closePopup()
        }
      }
    })
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("popupShown", "true")
    })

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
      vi: "JeongSeok - Du Lịch Thành Phố Hồ Chí Minh.",
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
