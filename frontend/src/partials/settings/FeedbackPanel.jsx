import React, { useState } from 'react';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function FeedbackPanel() {
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch(`${backendUrl}/user/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!')
        setRating(3);
        setComment('');
      } else {
        alert('Failed to submit feedback.');
      }
    } catch (error) {
      toast.error('An error occurred while submitting feedback.')
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <div className="grow">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl text-slate-800 font-bold mb-4">Give Feedback</h2>
          <div className="text-sm">Our product depends on customer feedback to improve the overall experience!</div>
        </div>

        <section>
          <h3 className="text-xl leading-snug text-slate-800 font-bold mb-6">How likely would you recommend us to a friend or colleague?</h3>
          <div className="w-full max-w-xl">
            <div className="relative">
              <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200" aria-hidden="true"></div>
              <ul className="relative flex justify-between w-full">
                {[1, 2, 3, 4, 5].map(num => (
                  <li key={num} className="flex">
                    <button
                      className={`w-3 h-3 rounded-full border-2 ${rating === num ? 'bg-indigo-500 border-indigo-500' : 'bg-white border-slate-400'}`}
                      onClick={() => setRating(num)}
                    >
                      <span className="sr-only">{num}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full flex justify-between text-sm text-slate-500 italic mt-3">
              <div>Not at all</div>
              <div>Extremely likely</div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl leading-snug text-slate-800 font-bold mb-5">Tell us in words</h3>
          <label className="sr-only" htmlFor="feedback">Leave a feedback</label>
          <textarea
            id="feedback"
            className="form-textarea w-full focus:border-slate-300"
            rows="4"
            placeholder="I really enjoy…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </section>
      </div>

      <footer>
        <div className="flex flex-col px-6 py-5 border-t border-slate-200">
          <div className="flex self-end">
            <button className="btn border-slate-200 hover:border-slate-300 text-slate-600">Cancel</button>
            <button
              className="btn bg-indigo-500 hover:bg-indigo-600 text-white ml-3"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FeedbackPanel;
