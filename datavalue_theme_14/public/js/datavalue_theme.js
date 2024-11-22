(function ($) {
    'use strict';

    function sidebar_niceScroll() {
        $('.side-menu .side-menu-icons > ul, .side-menu .side-menu-items > ul.dropdown-list').niceScroll({
            cursorcolor: "rgba(0,0,0,0.35)",
            cursorborder: "0px",
            cursorwidth: "3px",
        });
    }

    $(document).ready(function () {

        // navbar search
        $(this).on('click', '.dv-navbar .open-search', function (event) {
            event.preventDefault();
            $('.dv-navbar .dv-nav-search').fadeIn();
            $('.dv-navbar .dv-nav-search .form-control').trigger('focus');
        });
        $(this).on('click', '.dv-navbar .dv-nav-search .dv-nav-search-close', function (event) {
            event.preventDefault();
            $('.dv-navbar .dv-nav-search').fadeOut();
        });

        $(this).on('click', '.dv-navbar .btn-open-mobile-menu', function (event) {
            event.preventDefault();
            if ($(this).hasClass('show-menu')) {
                $(this).removeClass('show-menu').find('i').addClass('fa-bars').removeClass('fa-times');
                $('.side-menu').hide();
                $('.side-mobile-menu').hide();
            } else {
                $(this).addClass('show-menu').find('i').removeClass('fa-bars').addClass('fa-times');
                $('.side-menu').show();
                $('.side-mobile-menu').show();
            }
        });

        $(this).on("page-change", function () {
            $('.dv-app-theme').removeClass('show-overlay');
        });

        // tooltip
        $('[data-toggle="tooltip"]').tooltip({boundary: 'window'});
        $('[data-toggle="tipsy"]').tipsy({fade: true, gravity: 'w'});

        // side menu
        $(this).on('click', '.side-menu .side-menu-icons > ul > li > a', function (event) {
            $(this).parents('ul').find('>li').removeClass('active');
            $(this).parent().addClass('active');
        });

        // files icon
        $(this).on('click', '.dv-navbar .files-icon', function (event) {
            event.preventDefault();
            frappe.set_route("List", "File");
        });

        // fullscreen icon
        $(this).on('click', '.dv-navbar .full-screen-icon', function (event) {
            event.preventDefault();
            $('body').fullscreen();
            if ($.fullscreen.isFullScreen()) {
                $('i', this).removeClass('fa-compress').addClass('fa-expand');
                $.fullscreen.exit();
            } else {
                $('i', this).removeClass('fa-expand').addClass('fa-compress');
            }
        });

        // change language
        $(this).on("click", "#header-navbar-change-lang .dropdown-item", function (event) {
            event.preventDefault();
            let $this = $(this);
            let language = $this.data('lang');
            let selected_flag = $this.find(".dv-lang-flag").attr("class");
            $("#header-navbar-change-lang .dropdown-lang-link").html(`<span class="${selected_flag}"></span> ${language}`);
            frappe.call({
                method: "datavalue_theme_14.api.change_language",
                args: { language: language.toLowerCase() },
                callback: function (r) {
                    localStorage.setItem("active_lang", language);
                    frappe.ui.toolbar.clear_cache();
                }
            });
        });

        // side menu dropdown
        $(this).on('click', '.side-menu .side-menu-items > ul.dropdown-list > li > a, .side-menu ul.mobile-modules-menu-list > li > a', function () {
            if ($(this).parent().hasClass('active')) {
                if (!$(this).parent().hasClass('hide-sub-menu')) {
                    $(this).parent().addClass('hide-sub-menu');
                    $(this).parent().find('>ul').slideUp();
                } else {
                    $(this).parent().removeClass('hide-sub-menu');
                    $(this).parent().find('>ul').slideDown();
                }
            } else {
                $('.side-menu .side-menu-items > ul.dropdown-list > li, .side-menu ul.mobile-modules-menu-list > li').removeClass('hide-sub-menu active').find('>ul').slideUp();
                $(this).parent().removeClass('hide-sub-menu').addClass('active');
                $(this).parent().find('>ul').slideDown();
            }
            setTimeout(() => {
                $('.side-menu .side-menu-items > ul.dropdown-list').getNiceScroll().resize();
            }, 500);
        });

        $(this).on('mouseover', '.animated-tada', function () {
            $('.animated-icon', this).addClass('animated tada');
        }).on('mouseout', function () {
            $('.animated-icon', this).removeClass('animated tada');
        });

        $(this).on('mouseover', '.btn-toggle-main-menu', function () {
            let is_menu_shown = $(this).hasClass('menu-shown');
            if (is_menu_shown) {
                $('>i.far', this).removeClass('fa-bars fa-chevron-double-right').addClass('fa-chevron-double-left');
            } else {
                $('>i.far', this).removeClass('fa-bars fa-chevron-double-left').addClass('fa-chevron-double-right');
            }
        }).on('mouseout', '.btn-toggle-main-menu', function () {
            $('>i.far', this).removeClass('fa-chevron-double-left fa-chevron-double-right').addClass('fa-bars');
        });

        $(this).on('click', '.btn-toggle-main-menu', function () {
            let is_menu_shown = $(this).hasClass('menu-shown');
            if (is_menu_shown) {
                $(this).removeClass('menu-shown');
                $('body').addClass('hide-main-menu');
            } else {
                $(this).addClass('menu-shown');
                $('body').removeClass('hide-main-menu');
            }
        });

        $(this).on('click', '.btn-open-modules', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active').find('i').removeClass().addClass('flaticon-menu');
                $('.modules-menu').fadeOut();
            } else {
                $(this).addClass('active').find('i').removeClass().addClass('fal fa-times');
                $('.modules-menu').toggle(300);
            }
        });
    });

    $(document).on("page-change", function () {
        $('.btn-open-modules').removeClass('active').find('i').removeClass().addClass('flaticon-menu');
        $('.modules-menu').fadeOut();
        if (window.innerWidth <= 820) {
            $('.dv-navbar .dv-nav-search').hide();
            $('.dv-navbar .btn-open-mobile-menu').removeClass('show-menu').find('i').addClass('fa-bars').removeClass('fa-times');
            $('.side-menu').hide();
            $('.side-mobile-menu').hide();
        }
    });

    $(document).on("app-loaded", function () {
        if (frappe.is_app_loaded)
            return;

        // Company Logo Logic
        const appLogo = document.querySelector('#datavalue-app-logo img');
        frappe.call({
            type: 'POST',
            method: 'datavalue_theme_14.api.get_company_logo',
            args: {},
            callback: function (response) {
                if (response.message && response.message.length) {
                    appLogo.src = response.message;
                } else {
                    appLogo.src = 'https://einvoice2.mazeworkssolutions.com/maze_eserver/images/maze_logo.jpg';
                }
            }
        });

        // User Information Logic
        const user = frappe.get_cookies();
        const userNameElement = document.querySelector('.user-name');
        const userStatusElement = document.querySelector('.user-status');
        const userData = frappe.get_cookies();
        
        frappe.db.get_value('User', userData.user_id, 'user_type', function(response) {
            let user_type = '';
            if (userData.user_id === 'Administrator') {
                user_type = __('Administrator');
            } else {
                user_type = response.user_type ? __(response.user_type) : __('User');
            }
            userNameElement.textContent = user.full_name || 'Guest';  // Assuming full_name is available in cookies
            userStatusElement.textContent = user_type
        });

        // Language Change Logic
        const langList = {
            EN: { label: 'EN', flag: 'dv-lang-flag lang-en' }
        };
        const langDropdown = document.querySelector("#header-navbar-change-lang .dropdown-lang-link");

        frappe.call({
            method: "datavalue_theme_14.api.get_current_language",
            args: {},
            callback: function (response) {
                const activeLang = response.message ? response.message.toUpperCase() : localStorage.getItem("active_lang") || 'EN';
                langDropdown.innerHTML = `<span class="${langList[activeLang].flag}"></span> ${activeLang}`;
            }
        });
    });

})(jQuery);
