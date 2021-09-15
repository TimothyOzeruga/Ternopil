
    /* fixed menu */
$(function(){
    $(window).scroll(function(){
        if($(window).scrollTop()>60){
            $(".header").addClass("fixed");
        }else{
            $(".header").removeClass("fixed");
        }
    });

      /* hamburger */

    $(".hamburger, #menu_shadow").click(function(){
                $('.hamburger').toggleClass("is-active");
                $("body").toggleClass("open");
    });

    $(".mobile_menu a").click(function(){
        $('.hamburger').removeClass("is-active");
        $("body").removeClass("open");
    });


    /* map */

    let map;
    $("#map_link").click(function(){

        map = L.map('map').setView([49.54856647119282, 25.600953184844233], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        $("#map_link").remove();
        $("#map_pic").remove();
    });


    
    /* json */

    function getContactInfo() {
        axios 
            .get('../contact_adress.json')
            .then((resp)=>{
                let div = '<div class="contact__phones_wrap">';
                div += `<div class="contact__title">${resp.data[0].adress_name}</div>`;
                div += ` <div class="contact__text">${resp.data[0].adress_1}</div>`
                div += ` <div class="contact__text">${resp.data[0].adress_2}</div>`
                div += ` <a href="mailto:${resp.data[0].email}" class="contact__text contact__link">${resp.data[0].email}</a>`
                div += '</div>'

                $('.contact__phones').html(div);
            });
        }
    getContactInfo() 

    function getNumberInfo(){
        axios 
            .get('../contact_numbers.json')
            .then((resp)=>{
                let div = '<div class="contact__adress_wrap">';
                div += `<div class="contact__title">${resp.data[0].number_name}</div>`;
                div += ` <a href="tel:${resp.data[0].number_1}" class="contact__text contact__link">${resp.data[0].number_1}</a>`
                div += ` <a href="tel:${resp.data[0].number_2}" class="contact__text contact__link">${resp.data[0].number_2}</a>`
                div += '</div>'

                $('.contact__adress').html(div);
            });
    }
    getNumberInfo()



    /* form validation */

    $(function(){
        $("#form").on("submit", function(e){
            e.preventDefault();
            sendMessage($(this));
        });
        $("input, textarea").on("focus", function(){
            if($(this).parents(".form_row").hasClass("has_err")){
                if($(this).attr("name")!=="email"){
                    $(this).parents(".form_row").removeClass("has_err");
                    $(this).next("div").text("");
                }
            }
        });
        $("input[name='email']").on('keyup', function(){
            if(!validateEmail($(this).val())){
                $(this).parents(".form_row").addClass("has_err");
                $(this).next("div").text("Invalid email adress");
            }else{
                $(this).parents(".form_row").removeClass("has_err");
                $(this).next("div").text("");
            }
        })
    });
    
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }
    
    
    function sendMessage($form){
        const BOT_TOKEN = '1868758005:AAFgwAos7OsqEj3SOED9FgCKKspGO5USmGQ';
        const CHAT_ID = '-1001207500168';
        const nameee = namee.value;
        const emaill = email.value;
        const phonee = phone.value;
        const text = 'Name:'+nameee+
        '\ Email:'+emaill+
        '\ Phone:'+phonee;
            
        let valid = true;
        $("form").find('*[data-required]').each(function(){
            if($(this).val()===''){
                valid = false;
                $(this).parents(".form_row").addClass("has_err");
                $(this).next("div").text("Field is requaired");
            }else{
                if($(this).attr("name")==="email"){
                    if(!validateEmail($(this).val())){
                        valid = false;
                        $(this).parents(".form_row").addClass("has_err");
                        $(this).next("div").text("Invalid email adress");
                    }
                }
            }
        });
        if(valid){
            axios
            .get('https://api.telegram.org/bot'+BOT_TOKEN+'/sendMessage?chat_id='+CHAT_ID+'&text='+text)
            .then((resp)=>{
                console.log(resp.data.ok)
                if(resp.data.ok===true){
                    topPanel.success('Ваши данные отправленны', true);
                    $("#form").trigger('reset');
                }else{
                    topPanel.warning('error', true);
                }
            })
            .catch((err)=>{
                alert(err);
            });
        }
    }
    
    const topPanel = {
        success(text = "Some text here", autoclose = true) {
        this.showPanel(text, "success", autoclose);
        },
        warning(text = "Some text here", autoclose = false) {
        this.showPanel(text, "warning", autoclose);
        },
        showPanel(text, type, autoclose) {
        let btn = autoclose
            ? ""
            : '<button onclick="topPanel.closePanel()>&times;</button>';
        let h = `<div id="top_panel" class="panel_${type}">
            <p>${text}</p>${btn}<div></div>`;
        if (document.getElementById("top_panel") !== null) {
            this.closePanel();
        }
        document
            .getElementsByTagName("body")[0]
            .insertAdjacentHTML("afterbegin", h);
        if (autoclose) {
            const _this = this;
            setTimeout(function () {
            _this.closePanel();
            }, 3000);
        }
        },
        closePanel() {
        document.getElementById("top_panel").remove();
        },
    };


    /* wow.js */

    let wow;
    wow = new WOW(
        {
            boxClass: 'wow',    
            animateClass: 'animate__animated', 
            offset: 20,         
            mobile: true,       
            live: true        
        }
    )
    wow.init();
    
});