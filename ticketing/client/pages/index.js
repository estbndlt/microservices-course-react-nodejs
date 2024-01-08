import axios from 'axios';

const Landing = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Index</h1>;
};

Landing.getInitialProps = async ({ req }) => {
  if (typeof window === 'undefined') {
    // on the server
    const { data } = await axios.get(
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    // on the browser
    const { data } = await axios.get('/api/users/currentuser');
    return data;
  }
};

export default Landing;
