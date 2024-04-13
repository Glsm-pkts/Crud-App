
//!gerekli html elementlerini seç
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const container = document.querySelector(".grocery-container")
const list = document.querySelector(".grocery-list")
const submitBtn = document.querySelector(".submit-btn");
const alert = document.querySelector(".alert")
const clearBtn = document.querySelector(".clear-btn")



//!düzenleme seçenekleri
let editElement;
let editFlag = false; //düzenleme modunda olup olmadığını belirtir
let editID = "";// düzenleme yapılan öğenin benzersiz kimliği


//!fonksiyonlar
const setBackToDefault = () => {
    grocery.value = "";
    editFlag = false
    editID = "";
    submitBtn.textContent = "Ekle";
}
const displayAlert = (text, action) =>{
alert.textContent = text;
alert.classList.add(`alert-${action}`);
setTimeout(() => {
alert.textContent = ""
alert.classList.remove(`alert-${action}`)
},2000)
 };

 //tıkladığımız articlre etiketini ekrandan kaldıracak fonksiyondur

const deleteItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement//article etiketine eriştik
    const id = element.dataset.id
    list.removeChild(element);//list etiketi içerisinden article etiketini kaldırdık
    displayAlert("öğe kaldırıldı", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}

const editItem = (e) => {
    const element = e.currentTarget.parentElement.parentElement;//article etiketine eriştik
 
    editElement = e.currentTarget.parentElement.previousElementSibling;//buttonun kapsayıcısına eriştikten sonra kapsayıcının kardrs etikitine eriştik p etiketine yani

    grocery.value = editElement.innerText;//tıkladıgın article etk. içerisindeki p etik. textini inputtun içerisine gönderdik
    
    editFlag = true;
    editID = element.dataset.id//düzenlenen öğenin kimliğine erişme
    submitBtn.textContent = "Düzenle"// düzenleme işleminde submit btn içerik kısmını güncelledik

}



const addItem = (e) =>{
    e.preventDefault();//*formun otomatik olarak gönderilmesini engeller
    const value = grocery.value//*form içerisinde bulunan inputun değerini aldık
    const id = new Date().getTime().toString();//*benzersiz bir id oluşturduk
    
//eğer input boş değilse ve düzenlenme modunda değlse
    
if(value !== "" && !editFlag){

    const element = document.createElement("article")//yeni bir article etiketi olusturuldu
   let attr = document.createAttribute("data-id") //yeni bir veri kimliği oluşturur
   attr.value = id;
   element.setAttributeNode(attr)//olusturduğumuz id articleye ekledik
   element.classList.add("grocery-item");//oluşturduğumuz article etiketine class ekledik
element.innerHTML = `
<p class="title">${value}</p> 
<div class="btn-container">
<button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
<button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
</div>`;


const deleteBtn = element.querySelector(".delete-btn")
deleteBtn.addEventListener("click", deleteItem);
const editBtn = element.querySelector(".edit-btn");
editBtn.addEventListener("click", editItem);


 // Kapsayıcıya oluşturduğumuz "article" etiketini ekledik
 list.appendChild(element);
 displayAlert("Başarıyla Eklenildi", "success");
 container.classList.add("show-container");
 // localStorage a ekleme
 addToLocalStorage(id, value);
 // Değerleri varsayılana çevirir
 
 setBackToDefault();
}
else if(value !== "" && editFlag){
    //değiştireceğimiz p etiketinin içerik kısmına kul inputa gireceği değeri gönderdik
    editElement.innerText = value;
    //alert
    displayAlert("Değer Değiştirildi", "success");
    editLocalStorage(editID, value);
   setBackToDefault();
}

}

const clearItems =(e)  =>{
const items = document.querySelectorAll(".grocery-item")
//listede öğe varsa çalışır
if(items.length > 0){
    items.forEach((item) => list.removeChild (item)
);
}//container yapısını izle
container.classList.remove("show-container")
displayAlert("Liste Boş","danger" )
setBackToDefault();
};

const createListItem = (id, value) => {
    const element = document.createElement("article")//yeni bir article etiketi olusturuldu
   let attr = document.createAttribute("data-id") //yeni bir veri kimliği oluşturur
   attr.value = id;
   element.setAttributeNode(attr)//olusturduğumuz id articleye ekledik
   element.classList.add("grocery-item");//oluşturduğumuz article etiketine class ekledik
element.innerHTML = `
<p class="title">${value}</p> 
<div class="btn-container">
<button type="button" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></button>
<button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
</div>`;


const deleteBtn = element.querySelector(".delete-btn")
deleteBtn.addEventListener("click", deleteItem);
const editBtn = element.querySelector(".edit-btn");
editBtn.addEventListener("click", editItem);


 // Kapsayıcıya oluşturduğumuz "article" etiketini ekledik
 list.appendChild(element);
 
 container.classList.add("show-container");
};

const setupItems = () => {
    let items = getLocalStorage();
    if (items.length > 0) {
      items.forEach((item) => {
        createListItem(item.id, item.value);
      });
    }
  };

//!olay izleyicileri
form.addEventListener("submit", addItem)
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems)

/* local storage  */
// yerel depoya öğe ekleme işlemi
const addToLocalStorage = (id, value) => {
    const grocery = { id, value };
    let items = getLocalStorage()
    items.push(grocery)
    console.log(items);
    localStorage.setItem("list", JSON.stringify(items));
  };
  // yerel depodan öğeleri alma işlemi
  const getLocalStorage = () => {
  return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [] ;
      
  };
//localstorgeden veriyi silme
const removeFromLocalStorage = (id) => {
    //localstorgeden bulunan verileri getir
    let items = getLocalStorage ();
    //tıkladığım etiket ile etiketin id ile eşit değil ise bunu diziden çıkar yeni elemana aktar
  items =  items.filter((item) => {if(item.id !== id){
    return items;

   }})
   localStorage.setItem("list", JSON.stringify(items));

}

// Yerel depoda update işlemi
const editLocalStorage = (id, value) => {
    let items = getLocalStorage();
    // yerel depodaki verilerin id ile güncellenecek olan verinin idsi biribirne eşit ise inputa girilen value değişkenini al
    // localStorageda bulunan verinin valuesuna aktar
    items = items.map((item) => {
      if (item.id === id) {
        item.value = value;
      }
      return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
  };















