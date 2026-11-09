import Menu   from "./modules/Menu.js";
import Slider from "./modules/Slider.js";

new Menu();
new Slider('services', {
    breakpoints: {
        850: { 
            slidesPerView: 2
        },
        0: { 
            slidesPerView: 1 
        }
    }
    
});
    new Slider('reviews', {
        breakpoints: {
            700: { 
                slidesPerView: 2
            },
            0: { 
                slidesPerView: 1 
            }
        }
        
    });