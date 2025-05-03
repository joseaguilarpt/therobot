import { ActionFunction } from '@remix-run/node';
import HomePage from './$lang._index';
import { toolAction } from '~/utils/toolUtils';

export const action: ActionFunction = async ({ request }) => {
  return toolAction(request);
};

const Home = HomePage;

export default Home;
