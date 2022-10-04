# readFile
A Class and abstractions to handle fetching a file from the machine

These classes support finding a file, as well as some enhanced use cases such as:

  1) Creating a file
  2) Creating a directory
  3) Reading files from a directory

Design decision:
The NODE class is used as an abstract class in this case, and I wanted to add the 'parent' property to this abstract class because, when finding a file,  we may have to traverse back up the tree, and maintaining a pointer to the parent helps achieve that
