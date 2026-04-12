// Save data with expiry time (in milliseconds)
export const setWithExpiry = (key, value, expiryInMs) => {
  const now = Date.now();

  const item = {
    value,
    expiry: now + expiryInMs,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

// Get data which expires
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  // If item does not exist, return null
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  // Check if expired
  if (now > item.expiry) {
    localStorage.removeItem(key); // delete expired cache
    return null;
  }


  return item.value; // return actual data
};

export const updateValueKeepExpiry = (key, newValue) => {
  const itemStr = localStorage.getItem(key);

  // If item doesn't exist, do nothing (or create new if you want)
  if (!itemStr) return false;

  const item = JSON.parse(itemStr);
  const now = Date.now();

  // If expired, remove it
  if (now > item.expiry) {
    localStorage.removeItem(key);
    return false;
  }

  // Update only the value, keep expiry same
  const updatedItem = {
    value: newValue,
    expiry: item.expiry,
  };

  localStorage.setItem(key, JSON.stringify(updatedItem));
  return true;
};
