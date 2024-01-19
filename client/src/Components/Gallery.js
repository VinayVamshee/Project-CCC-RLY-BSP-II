import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Gallery() {

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

  const [Card, setCard] = useState({
    Image: '',
    Description: '',
    Link: ''
  })

  const AddNewCard = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/AddNewCard", { ...Card })
        .then(result => {
          console.log(result)
          alert('New Card Added')
          window.location.reload();
        })
        .catch(error => console.log(error))
    } catch (error) {
      console.log(error);
    }
  }

  const [AllCard, setAllCard] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/GetCards')
      .then(result => setAllCard(result.data))
      .catch(error => console.log(error))
  }, [])

  const DeleteCard = async (id) => {
    axios.delete('http://localhost:3001/DeleteCard/' + id)
      .then(result => {
        console.log(result)
        window.location.reload();
      })
      .catch(error => console.log(error))
  }

  const ChangeImageUrl = (e) => {
    const url = e.target.value;
    if (!url.includes("drive.google.com")) {
      setCard({ ...Card, Image: url })
    } else {
      // USE FOR ONLY IMAGES AND NOT FOR IFRAME
      // const match = url.match(/\/d\/(.*?)\//);
      // const fileId = match ? match[1] : null;
      // const viewableUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : null;
      // setCard({ ...Card, Image: viewableUrl });

      //USE FOR IFRAMES ONLY
      const viewableUrl = url.replace('/view?usp=sharing', '/preview');
      setCard({ ...Card, Image: viewableUrl })
    }
  };


  const [SearchQuery, setSearchQuery] = useState('');

  return (
    <div className='Gallery'>
      <div className='Search'>
        <input value={SearchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search Gallery ...' />
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 Gallery-card">
        {
          AllCard && AllCard.slice().reverse().filter((Card) => Card.Description.toLowerCase().includes(SearchQuery.toLowerCase())).map((Element, idx) => {
            const animationDelay = `${idx * 0.1}s`;
            return (
              <div className="col" key={idx}>
                <div className="card PopRight shadow-sm" style={{ animationDelay }}>
                  <img src={Element.Image} alt='...' />
                  <div className="card-body">
                    <p className="card-text">{Element.Description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <a href={Element.Link} target='_blank' rel="noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                        {
                          IsLoggedIn ?
                            <button className='btn btn-sm btn-outline-danger' onClick={() => DeleteCard(Element._id)}>Delete</button>
                            :
                            null
                        }
                      </div>
                      <small className="text-body-secondary">RLY</small>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }

      </div>

      <div className='AddNew'>
        {
          IsLoggedIn ?
            <button className='btn btn-warning' data-bs-toggle="modal" data-bs-target="#AddNewCardModal">Add New Card</button>
            :
            null
        }


        <div className="modal fade" id="AddNewCardModal" tabIndex="-1" aria-labelledby="AddNewCardModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={AddNewCard}>
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="AddNewCardModalLabel">New Card</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <label>Card Image</label>
                  <input type='text' value={Card.Image} onChange={ChangeImageUrl} placeholder='Image Link Only' />
                  <label>Card Description</label>
                  <input type='text' value={Card.Description} onChange={(e) => setCard({ ...Card, Description: e.target.value })} placeholder='Description' />
                  <label>Drive Link</label>
                  <input type='text' value={Card.Link} onChange={(e) => setCard({ ...Card, Link: e.target.value })} placeholder='Drive Link Only ...' />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Card</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
