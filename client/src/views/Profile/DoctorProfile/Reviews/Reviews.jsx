import React, { useEffect, useState } from 'react';
import './Reviews.scss';
import axios from 'axios';
import ip from '../../../../ip';
import moment from 'moment'


const swal = require('sweetalert2')
function Reviews({ doctor_id }) {
  const [rating, setRating] = useState(0); // Default rating

  const handleRatingChange = (event) => {
    const selectedRating = parseInt(event.target.value); // Get the selected rating value
    setRating(selectedRating); // Update the rating state
  };



  const [reviewText, setReviewText] = useState('')
  const adjustTextareaHeight = (textarea) => {
    const maxHeight = 200;
    textarea.style.height = '25px'; // Reset height to auto to calculate the new height
    textarea.style.height = 100 + Math.min(textarea.scrollHeight, maxHeight) + 'px'; // Set the new height, max maxHeightpx
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    }
  };

  const handleCommentTextareaChange = (e) => {
    setReviewText(e.target.value);
    adjustTextareaHeight(e.target);
  };



  const addReview = async (e) => {
    e.preventDefault()
    console.log(rating)
    console.log(reviewText)
    if (rating > 0 && reviewText?.length > 0) {
      try {
        const response = await axios.post(`${ip}/review/add-review/${doctor_id}/`, {
          ratings: rating,
          review: reviewText
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 201) { // Assuming 200 is the status for a successful request
          const data = response.data;
          console.log('response is : ', data)
          setRating(0)
          setReviewText('')
          swal.fire({
            title: "Review Added.",
            icon: "success",
            toast: true,
            timer: 3000,
            position: "top-right",
            timerProgressBar: true,
            showConfirmButton: false,
            showCloseButton: true,
          });
        } else {
          console.error('Error fetching posts:', response.statusText);
          // Handle error state as needed
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Handle error state as needed
      }
    }
    else {
      swal.fire({
        title: "Please fill all fields.",
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


  const [reviews, setReviews] = useState([])
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${ip}/review/get-reviews/${doctor_id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) { // Assuming 200 is the status for a successful request
        const data = response.data;
        console.log('response is : ', data)
        setReviews(data)
      } else {
        console.error('Error fetching reviews:', response.statusText);
        // Handle error state as needed
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Handle error state as needed
    }
  }


  useEffect(() => {
    fetchReviews()
  }, [])


  return (
    <>
      <div className="reviews-container">
        <h4>Recent Reviews</h4>
        <div className="reviews">
          {reviews && reviews.map((review) => {
            return (
              <div className="review">
                <div className="image" style={review?.reviewer.image ? {
                  backgroundImage: `url(${review.reviewer.image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                } : null}>

                </div>

                <div className="right">
                  <div className="top">
                    <p>{review.reviewer.username}</p>
                    <span>{moment.utc(review?.date).local().startOf('seconds').fromNow()}</span>
                  </div>

                  <div className="ratings">
                    <div class="rating">
                      {[5, 4, 3, 2, 1].map((ratingValue) => (
                        <React.Fragment key={ratingValue}>
                          <input
                            value={ratingValue}
                            name={`rating${review?.id}`}
                            id={`star${ratingValue}-${review.id}`}
                            type="radio"
                            checked={review.ratings === ratingValue}
                            readOnly
                          // You can add an onChange handler here if needed
                          />
                          <label htmlFor={`star${ratingValue}-${review.id}`}></label>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <p className='review-text'>{review?.review}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="add-review">
        <h4>Leave a Review</h4>

        <form onSubmit={addReview}>
          <div className="rating">
            <input value="5" name="rate" id="star5" type="radio" onChange={handleRatingChange} checked={rating == 5} />
            <label title="text" htmlFor="star5"></label>
            <input value="4" name="rate" id="star4" type="radio" onChange={handleRatingChange} checked={rating == 4} />
            <label title="text" htmlFor="star4"></label>
            <input value="3" name="rate" id="star3" type="radio" onChange={handleRatingChange} checked={rating == 3} />
            <label title="text" htmlFor="star3"></label>
            <input value="2" name="rate" id="star2" type="radio" onChange={handleRatingChange} checked={rating == 2} />
            <label title="text" htmlFor="star2"></label>
            <input value="1" name="rate" id="star1" type="radio" onChange={handleRatingChange} checked={rating == 1} />
            <label title="text" htmlFor="star1"></label>
          </div>

          <div className="textarea">
            <textarea placeholder='Type your review here...' value={reviewText} onChange={handleCommentTextareaChange}></textarea>
          </div>

          <button type='submit'>Submit</button>
        </form>
      </div>
    </>
  );
}

export default Reviews;
