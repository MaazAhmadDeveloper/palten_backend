import { Faqs } from "../models/faqsModel.js";
import { Blog } from "../models/blogsModel.js";

// Route to handle email verification
export const getFaqsController = async (req, res) => {
    try {
      const allFaqs = await Faqs.find();
      res.status(200).send({allFaqs});
      
    } catch (error) {
      console.log('Error while get data of Faqs from DB');
      return res.status(400).send('Error while get data of Faqs from DB');
    }
    
  };
  
  
  
  
export const getBlogsController = async (req, res) => {

    try {
        const allBlogs = await Blog.find();
        res.status(200).send({allBlogs});
        
      } catch (error) {
        console.log('Error while get data of Blogs from DB');
        return res.status(400).send('Error while get data of Blogs from DB');
      }

  };
  

