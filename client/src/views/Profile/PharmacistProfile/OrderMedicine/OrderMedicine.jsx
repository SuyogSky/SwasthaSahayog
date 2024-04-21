import React, { useState } from 'react'
import './OrderMedicine.scss'
import useAxios from '../../../../utils/useAxios'
import ip from '../../../../ip'
import OrderMap from './OrderMap/OrderMap'



const swal = require('sweetalert2')
function OrderMedicine({ pharmacyId }) {

    const axios = useAxios()

    const [medicineDescription, setMedicineDescription] = useState('')
    const [medicineDescriptionImage, setMedicineDescriptionImage] = useState('')
    const [orderDescription, setOrderDescription] = useState('')
    const [orderLocation, setOrderLocation] = useState('')

    const handleOrderSubmit = async (e) => {
        e.preventDefault()
        if (orderLocation) {
            const order_location = `${orderLocation?.lat.toFixed(6)},${orderLocation?.lng.toFixed(6)}` || null
            const formData = new FormData()
            formData.append('medicine_description', medicineDescription)
            formData.append('order_description', orderDescription)
            formData.append('order_location', order_location)
            formData.append('pharmacy', pharmacyId)
            if (medicineDescriptionImage) {
                console.log('THis is sent image: ',medicineDescriptionImage)
                formData.append('medicine_description_image', medicineDescriptionImage)
            }
            try {
                const response = await axios.post(`${ip}/order/`, formData, {
                    headers: {
                        // 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    },
                })

                console.log('Response is: ', response)

                if(response.data.success === 1){
                    swal.fire({
                        title: response.data.message,
                        icon: "success",
                        toast: true,
                        timer: 3000,
                        position: "top-right",
                        timerProgressBar: true,
                        showConfirmButton: false,
                        showCloseButton: true,
                    });
                }
            }
            catch (error) {
                const response = error.response
                console.log(response)
                swal.fire({
                    title: response.data.error,
                    icon: "error",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    showCloseButton: true,
                });
            }
        }
        else {
            swal.fire({
                title: 'Order location is required.',
                icon: "warning",
                toast: true,
                timer: 3000,
                position: "top-right",
                timerProgressBar: true,
                showConfirmButton: false,
                showCloseButton: true,
            });
        }
    }
    return (
        <>
            <div className="medicine-form-container">
                <h2>Order Medicine Online</h2>
                <form className="order-medicine-form" action="" onSubmit={handleOrderSubmit}>
                    <div className="input-container medicine-details">
                        <label htmlFor="medicine-description">Medicine Description</label>
                        <textarea name="" id="" cols="30" rows="10" placeholder='Medicine Description' onChange={e => setMedicineDescription(e.target.value)}></textarea>
                    </div>

                    <div className="input-container image-description">
                        <label htmlFor="image-description">Medicine Description (Image)</label>
                        <input type="file" onChange={e => setMedicineDescriptionImage(e.target.files[0])} />
                    </div>

                    <div className="input-container order-description">
                        <label htmlFor="order-description">Order Description</label>
                        <textarea name="" id="" cols="30" rows="10" placeholder='Enter your order description or remarks here...' onChange={e => setOrderDescription(e.target.value)}></textarea>
                    </div>

                    <div className="input-container add-location-container">
                        <label htmlFor="">Order Location <span>*</span></label>
                        <div className="map-container">
                            <OrderMap setOrderLocation={setOrderLocation} />
                        </div>
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
}

export default OrderMedicine