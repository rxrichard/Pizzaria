const q = (e) => document.querySelector(e);
const qa = (e) => document.querySelectorAll(e);
let modalQt = 1;
let cart = [];
let modalKey = 0;

//Listagem das Pizzas
pizzaJson.map((item, i) => {
  //clona os itens do model e pizza para criar os itens da lista
  let pizzaItem = q(".models .pizza-item").cloneNode(true);

  //preencher as informaçõse em pizzaItem

  pizzaItem.setAttribute("data-key", i); //identifica a pizza clicada
  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price
    .toFixed(2)
    .replace(".", ",")}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;

  //adiciona o evento de click direto pelo js para abrir o modal
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();

    //acha o item mais proximo que tenha o .pizza-item(retornana)
    let key = e.target.closest(".pizza-item").getAttribute("data-key");
    modalQt = 1;

    modalKey = key; //salva qual pizza foi clicada

    //preenche o modal com as informações da pizza clicada  e abre o modal

    q(".pizzaInfo h1").innerHTML = pizzaJson[key].name; //nome da pizza
    q(".pizzaInfo--desc").innerHTML = pizzaJson[key].description; //descrição da pizza
    q(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price
      .toFixed(2)
      .replace(".", ",")}`; //preço da pizza

    q(".pizzaBig img").src = pizzaJson[key].img; //imagem da pizza

    q(".pizzaInfo--qt").innerHTML = modalQt;

    //remove o selected da pizza anterior e adiciona a classe selected ao item clicado
    q(".pizzaInfo--size.selected").classList.remove("selected");

    //seleciona o tamanho da pizza
    qa(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }

      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]; //tamanho da pizza
    });

    //adiciona o evento de click no botão de fechar o modal

    //abre o modal
    q(".pizzaWindowArea").style.opacity = 0;
    q(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      q(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });
  q(".pizza-area").append(pizzaItem);
});

//Eventos modal

function closeModal() {
  q(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    q(".pizzaWindowArea").style.display = "none";
  }, 200);
}

qa(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

//adiciona o evento de click no botão de adicionar pizza
q(".pizzaInfo--qtmais").addEventListener("click", () => {
  modalQt++;
  q(".pizzaInfo--qt").innerHTML = modalQt;
});

q(".pizzaInfo--qtmenos").addEventListener("click", () => {
  if (modalQt > 1) {
    modalQt--;
    q(".pizzaInfo--qt").innerHTML = modalQt;
  }
});

//seleciona o tamanho da pizza nos buttons
qa(".pizzaInfo--size").forEach((size, sizeIndex) => {
  size.addEventListener("click", () => {
    q(".pizzaInfo--size.selected").classList.remove("selected");
    size.classList.add("selected");
  });
});

//adiciona a pizza ao carrinho
q(".pizzaInfo--addButton").addEventListener("click", () => {
  //tamanho da pizza
  let size = parseInt(q(".pizzaInfo--size.selected").getAttribute("data-key"));

  let identifier = `${pizzaJson[modalKey].id} @ ${size}`;

  if (cart.find((item) => item.identifier == identifier)) {
    //se a pizza já estiver no carrinho
    let itemCart = cart.find((item) => item.identifier == identifier);
    itemCart.qt += modalQt;
  } else {
    //se a pizza não estiver no carrinho
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt,
      price: pizzaJson[modalKey].price[size],
    });
  }

  updateCart();
  closeModal();
});

//abre menu carinho mobile
q('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    q('aside').style.left='0'
  }
})
q('.menu-closer').addEventListener('click', () => {
    q('aside').style.left='100vw'
})




function updateCart() {

  q('.menu-openner span').innerHTML = cart.length

  if (cart.length > 0) {
    q("aside").classList.add('show');
    q('.cart').innerHTML = '';//zera a lista de pizzas no carrinho

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    
    for(let i in cart){

      let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].qt;//calcula subtotal
      
      
      let cartItem = q(".models .cart--item").cloneNode(true);



      let pizzaSize;//pega tamanho da pizza
      switch(cart[i].size){
        case 0:
          pizzaSize = 'Pequena';
          break;
        case 1:
          pizzaSize = 'Média';
          break;
        case 2:
          pizzaSize = 'Grande';
          break;
      }


      //add image no carrinho
      cartItem.querySelector('img').src = pizzaItem.img;
      //addnome e tamanho da pizza
      cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${pizzaSize})`;
      //add quantidade
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; 
      

      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].qt > 1){
          cart[i].qt--;}
          else
          {
            cart.splice(i, 1);
          }
          updateCart();
      });

      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;
        updateCart();
      });


      q('.cart').append(cartItem);

    }

    desconto = subtotal * 0.1;

    total = subtotal - desconto;

    q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
    q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2).replace('.', ',')}`;

  } else {
    q("aside").classList.remove('show');
    q('aside').style.left='100vw'
  }
}
