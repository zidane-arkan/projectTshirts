
var products = {
    'white': {
        
        'plain': {
            'unit_price': 5.12,
            'photo': './img/v-white.jpg' 
        },
        'printed': {
            'unit_price': 8.95,
            'photo': './img/v-white-personalized.jpg' 
        }
    },
    
    'colored': {
        'plain': {
            'unit_price': 6.04,
            'photo': './img/v-color.jpg' 
        },
        'printed': {
            'unit_price': 9.47,
            'photo': './img/v-color-personalized.png' 
        }
    }
}


// Search params

var search_params = {
    "quantity": "10",
    "color": "colored",
    "quality": "",
    "style": "printed",
}


// Additional pricing rules:

// 1. The prices above are for Basic quality (q150). 
// The high quality shirt (190g/m2) has a 12% increase in the unit price.

// 2. Apply the following discounts for higher quantities: 
    // 1: above 1.000 units - 20% discount
    // 2: above 500 units - 12% discount
    // 3: above 100 units - 5% discount


// Solution:

$(function () {
    let color = $("#color");
    let quality = $("#quality");
    let styleSelect = $("select#style");
    let photoProduct = $("img#photo-product");
    //1. Update Box Color And Element With Selected Option
    //Function  1
    function updateClass(el, className) {
        el.forEach((e) => {
            $(e).toggleClass(className);    
        });
    }
    function updateProductBox() { 
        $(".refresh-loader").show();
        setTimeout(() => {
            let styleSelected =  $("select#style").val();
            photoProduct.attr("src", products[$(".color-option.selected").attr("id")][styleSelected].photo);
            $(".refresh-loader").hide();
        }, 600);
    }
    //End Function 1

    //2. Update Order Data
    //Function 2
    function orderDetail(nameClass, detailType) {
        $(".refresh-loader").show();
        setTimeout(() => {
            let objName = $(`${nameClass}`).parent().attr("id");
            let selectedClass = $(`${nameClass}.selected`);
            if (detailType == "select") {
                search_params[nameClass] = $(`select#${nameClass}`).val();
                $(`#result-${nameClass}`).text($(`select#${nameClass} option:selected`).text());
                    
            }else if (detailType == "input"){
                search_params[nameClass] = $(`input#${nameClass}`).val();
                $(`#result-${nameClass}`).text(search_params[nameClass]);
            } else { 
                search_params[objName] = selectedClass.attr("id");
                $(`#result-${detailType}`).text(selectedClass.text());
            }
            countPrice();
            $(".refresh-loader").hide();
        }, 600);
    }
    //End Function 2
    
    //3. Update Price
    //Function 3
    function checkDiscount(totalPrice) { 
        let totalQuantity = search_params.quantity;
        let discount,total,finalPrice;
        if (totalQuantity > 1000) {
            discount = 0.20;
        } else if (totalQuantity > 100 && totalQuantity < 500) {
            discount = 0.12;
        } else if (totalQuantity > 100) {
            discount = 0.05;
        } else { 
            discount = 0;
        }
        total = totalPrice - (totalPrice * discount); 
        finalPrice = total.toLocaleString("en-US", {style:"currency",currency:"USD"});
        return finalPrice.replace(".",",").replace(",",".");
    }
    function countPrice() { 
        let result = products[search_params.color][search_params.style].unit_price;
        let totalPrice = parseFloat(result);
        let price = $("#total-price");
        if (search_params.quality == "q150") {
            totalPrice = totalPrice * parseFloat(search_params.quantity);
        } else { 
            totalPrice = ((totalPrice * 0.12) + totalPrice) * parseFloat(search_params.quantity);
        }
        price.text(checkDiscount(totalPrice)); 
    }
    //End Function 3

    //Function Default Details in Page
    function defaultValue() { 
        updateProductBox();
        orderDetail(".color-option", "color");
        orderDetail("style", "select");
        orderDetail(".quality-option", "quality");
        orderDetail("quantity", "input");
    }
    //End Default Function

    //Give Element Method And Functions
    defaultValue();
    color.click(() => {
        updateClass(["#white", "#colored"], "selected");
        updateProductBox();
        orderDetail(".color-option","color");
    });
    quality.click(() => { 
        updateClass(["#q150", "#q190"], "selected");
        orderDetail(".quality-option","quality");
    });
    styleSelect.change(() => { 
        updateProductBox();
        orderDetail("style","select");
    });
    $("input#quantity").on({
        change: () => { 
            orderDetail("quantity", "input");
        },
        keyup: () => {
            orderDetail("quantity", "input");
        }
    });
    //End
    
});










