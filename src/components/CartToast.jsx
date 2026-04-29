export default function CartToast({cartToast}){
    return (
        
      <div className={`cart-toast ${cartToast.show ? "show" : ""}`}>
        <i className="bi bi-check-circle-fill"></i>
        <span>{cartToast.message}</span>
      </div>
    )
}