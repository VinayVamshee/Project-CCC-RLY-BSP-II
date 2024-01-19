import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function Notice() {

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

  const [Notice, setNotice] = useState({
    Title: '',
    Description: '',
    TimeAdded: ''
  })

  const AddNewNotice = async (e) => {
    e.preventDefault();
    try {
      const updatedNotice = { ...Notice, TimeAdded: new Date().toLocaleString() };
      setNotice(updatedNotice);
      await axios.post("http://localhost:3001/AddNewNotice", { ...updatedNotice })
        .then(result => {
          console.log(result)
          alert('New Notice Added')
          window.location.reload();
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }

  const [AllNotice, setAllNotice] = useState();

  useEffect(() => {
    axios.get('http://localhost:3001/GetNotice')
      .then(result => setAllNotice(result.data))
      .catch(error => console.log(error))
  }, [])

  const DeleteNotice = async (id) => {
    axios.delete('http://localhost:3001/DeleteNotice/' + id)
      .then(result => {
        console.log(result)
        window.location.reload();
      })
      .catch(error => console.log(error))
  }

  return (
    <div className='Notice'>
      <h1 className='Heading'>Notice</h1>
      {
        AllNotice && AllNotice.slice().reverse().map((Element, idx) => {
          const animationDelay = `${idx * 0.1}s`;
          return (
            <div className='card PopIn' style={{ animationDelay }} key={idx}>
              <div className='card-head'>
                <div className='card-title'>{Element.Title}</div>
                {
                  IsLoggedIn ?
                    <button className='btn btn-sm btn-danger' onClick={() => DeleteNotice(Element._id)}>Delete</button>
                    :
                    null
                }
              </div>
              <div className='card card-body'>
                {Element.Description}
              </div>
              <p className='text-end'>{Element.TimeAdded}</p>
            </div>
          )
        })
      }


      <div className='AddNew'>
        {
          IsLoggedIn ?
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
              Add New Notice
            </button>
            :
            null
        }


        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={AddNewNotice}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <label>Notice Title</label>
                  <input value={Notice.Title} onChange={(e) => setNotice({ ...Notice, Title: e.target.value })} placeholder='Title' />
                  <label>Description</label>
                  <input value={Notice.Description} onChange={(e) => setNotice({ ...Notice, Description: e.target.value })} placeholder='Description' />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Notice</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
