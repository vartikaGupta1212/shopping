const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
let cart = [];
let buttonsDOM = [];


class Product{
  async  display(){
    try{
    const jdata =await fetch("product.json");
    let data = await jdata.json();
    data = data.items;
    data = data.map(function(item){
      const {id} = item.sys;

      const{title,price} = item.fields;
      let image = item.fields.image.fields.file.url;
      return {id,title,price,image};
      });
      return data;
    }
    catch(error){
      console.log("ERROR");
    }
  }
}
class Url{
  getProducts(item){
    let result='';
    item.forEach((product)=>{
      result+=`<article class="product">
                 <div class="img-container">
                   <img src=${product.image} class="product-img"/>
                   <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>add to bag</button>
                  </div>
                  <h3>${product.title}</h3>
                  <h4>${product.price}</h4>
               </article>`
    });
      productsDOM.innerHTML=result;
  }
  getButtons(){
    const btns = [...document.querySelectorAll(".bag-btn")];
    console.log(btns);
    btns.forEach(button=>{
      let id=button.dataset.id;
      let inCart = cart.find(item=>item.id===id);
      if(inCart){
        button.innerText=`In Cart`;
        button.disabled = true;
      }
      button.addEventListener("click",(event)=>{
      event.target.innerText=`In Cart`;
      event.target.disabled = true;
      let cartItem ={...Storage.getProducts(id),amount:1};
      cart=[...cart,cartItem];
      Storage.saveCart(cart);
      this.addToCart(cart);
      this.addCartItem(cartItem);
        this.showCart();
      });

    });

  }
  updateCart(){

   this.clearCart();
   this.changeCartValues();

  }

  addToCart(scart)
  {
  let temptotal=0;
  let itemtotal = 0;
  scart.map(item=>{
  temptotal += item.price * item.amount;
  itemtotal+= item.amount;
});
     localStorage.setItem("itemtotal",JSON.stringify(itemtotal));
     localStorage.setItem("temptotal",JSON.stringify(temptotal));
     cartItems.innerText=itemtotal;
     cartTotal.innerText = temptotal;

  }
  addCartItem(item) {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `<!-- cart item -->
              <!-- item image -->
              <img src=${item.image} alt="product" />
              <!-- item info -->
              <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
              </div>
              <!-- item functionality -->
              <div>
                  <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">
                  ${item.amount}
                </p>
                  <i class="fas fa-chevron-down" data-id=${item.id}></i>
              </div>
            <!-- cart item -->
      `;
      cartContent.appendChild(div);
    }
    showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  closeCart(){
     closeCartBtn.addEventListener("click",()=>{
     cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  });
  }
  clearCart(){
    clearCartBtn.addEventListener("click",()=>{
      let cartID = cart.map(item=>item.id);
      cartID.forEach((ID)=>this.removeCart(ID));

    while (cartContent.children.length>0) {
    cartContent.removeChild(cartContent.children[0]);
  }
     });

  }


  setApp(){
    cart = Storage.getCart();
    console.log(cart);

    this.addToCart(cart);
    cart.forEach(item=>this.addCartItem(item));
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);

    
  }
  changeCartValues(){

  }
  removeCart(id){
   let afterRemoveCart = cart.filter(item=>item.id!==id);
   console.log(afterRemoveCart);

   this.addToCart(afterRemoveCart);
   Storage.saveCart(afterRemoveCart);
   let btn = [...document.querySelectorAll(".bag-btn")];
   console.log(btn);
   let button=btn.find(item=>item.dataset.id===id);
   button.innerText=`add to cart`;
   button.disabled = false;

  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  }



class Storage{
  static saveProducts(products){
    localStorage.setItem("products",JSON.stringify(products));
  }
  static getProducts(id)
  {
    let products=JSON.parse(localStorage.getItem("products"));
     return products.find((item)=>item.id===id);

  }
  static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart))
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
}

document.addEventListener("DOMContentLoaded",()=>{
  const product = new Product();
  const url= new Url();
   url.setApp();
  product.display().then(data => {

    url.getProducts(data);
    console.log(data);
    Storage.saveProducts(data);
  }).then(()=>{url.getButtons();
               url.updateCart();
             });
  });
