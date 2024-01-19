import React, { useEffect, useState } from 'react'
import axios from 'axios'
// import PNR from './PNGs/PNR.png'

export default function Admin() {

  const [IsLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true)
    }
    else {
      setIsLoggedIn(false)
    }
  }, [])

  const [Feedback, setFeedBack] = useState({
    Name: '',
    FeedbackData: '',
    TimeAdded: ''
  })

  const AddNewFeedback = async (e) => {
    e.preventDefault();
    try {
      const updatedFeedback = { ...Feedback, TimeAdded: new Date().toLocaleString() };
      await axios.post("http://localhost:3001/AddNewFeedback", { ...updatedFeedback })
        .then(result => {
          console.log(result)
          alert('Thank You For Your Valuable Time & Feedback !')
          window.location.reload();
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }

  const [AllFeedback, setAllFeedback] = useState();

  useEffect(() => {
    axios.get('http://localhost:3001/GetFeedback')
      .then(result => setAllFeedback(result.data))
      .catch(error => console.log(error))
  }, [])

  // const DeleteFeedback = async (id) => {
  //   axios.delete('http://localhost:3001/DeleteFeedback/' + id)
  //     .then(result => {
  //       console.log(result)
  //       window.location.reload();
  //     })
  //     .catch(error => console.log(error))
  // }




  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const AddAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/Register', { username, password })
        .then(result => {
          alert('User Registration Successful')
          console.log(result)
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }

  const CheckAdmin = async (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/Login', { username, password })
      .then(result => {
        if (result.data.token) {
          localStorage.setItem('token', result.data.token)
          alert('Login Successful')
          window.location.reload();
        }
        else if (result.data === 'Please Check the Password') {
          alert('Incorrect Password')
        }
        else {
          alert('Error')
        }
      })
      .catch(error => console.log(error))
  }

  const Logout = () => {
    const AskUser = window.confirm("Are you sure?")

    if (AskUser) {
      localStorage.removeItem('token');
      window.location.reload();
    }
  }

  return (
    <div className='Admin'>
      <div className='AddNew'>
        {
          IsLoggedIn ?
            <button type="button" className="btn btn-Link btn-outline-success" data-bs-toggle="modal" data-bs-target="#RegisterModal">
              New User
            </button>
            :
            null
        }
        {
          IsLoggedIn ?
            <button className='btn btn-Link btn-danger' onClick={Logout}>LogOut</button>
            :
            <button className='btn btn-Link btn-danger' data-bs-toggle="modal" data-bs-target="#LoginModal">Admin Login</button>
        }
      </div>
      <div className='AdminProfile'>
        <div className='AdminDetails'>
          <h1>PNR</h1>
        </div>
        <div className='Image'>
          <img className='PopRight' src='...' alt='...' />
        </div>
      </div>


      <div className='AddNew'>

        <button type="button" className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#FeedBackModal">
          Give Feedback !
        </button>

        <div className="modal fade" id="FeedBackModal" tabIndex="-1" aria-labelledby="FeedBackModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={AddNewFeedback}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="FeedBackModalLabel">Give Your Valuable Feedback !</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <label>Name</label>
                  <input value={Feedback.Name} onChange={(e) => setFeedBack({ ...Feedback, Name: e.target.value })} placeholder='Your Name ...' />
                  <label>Feedback</label>
                  <input value={Feedback.FeedbackData} onChange={(e) => setFeedBack({ ...Feedback, FeedbackData: e.target.value })} placeholder='Your Feedback ...' />
                </div>
                <div className="modal-footer">
                  <button type='submit' className="btn btn-primary">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>

      <div className='Feedbacks'>
        {
          IsLoggedIn ?
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseWidthExample" aria-expanded="false" aria-controls="collapseWidthExample">
              Feedbacks
            </button>
            :
            null
        }

        <div>
          <div className="collapse" id="collapseWidthExample">
            {
              AllFeedback && AllFeedback.slice().reverse().map((Element, idx) => {
                return (
                  <div key={idx} className="card card-header">
                    {Element.Name}
                    <div className=' card card-body'>
                      {Element.FeedbackData}
                    </div>
                    <p className='text-end mt-2'> {Element.TimeAdded}</p>
                  </div>
                )
              })
            }

          </div>
        </div>
      </div>






      <div className="modal fade" id="LoginModal" tabIndex="-1" aria-labelledby="LoginModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className='LoginForm' onSubmit={CheckAdmin}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="LoginModalLabel">Admin Login</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <input placeholder='Username' value={username} onChange={(event) => setUsername(event.target.value)} type='text' />

                <input placeholder='Password' value={password} onChange={(event) => setPassword(event.target.value)} type='password' />

              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="RegisterModal" tabIndex="-1" aria-labelledby="RegisterModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <form className='LoginForm' onSubmit={AddAdmin}>
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="RegisterModalLabel">Register</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder='Username' type='text' />

                <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder='Password' type='password' />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}
