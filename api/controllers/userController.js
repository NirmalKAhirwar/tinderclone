// import cloudinary from "../config/cloudinary.js";
// import User from "../models/User.js";

// export const updateProfile = async (req, res) => {
//   // image => cloudinary -> image.cloudinary.your => mongodb

//   try {
//     const { image, ...otherData } = req.body;

//     let updatedData = otherData;

//     if (image) {
//       // base64 format
//       if (image.startsWith("data:image")) {
//         try {
//           const uploadResponse = await cloudinary.uploader.upload(image);
//           cloudinary.image(uploadResponse.secure_url, {
//             transformation: [
//               {
//                 width: "auto",
//                 height: "auto",
//                 crop: "scale",
//               },
//               {
//                 quality: "auto",
//               },
//               { fetch_format: "auto" },
//             ],
//           });
//           updatedData.image = uploadResponse.secure_url;
//         } catch (error) {
//           console.error("Error uploading image:", uploadError);

//           return res.status(400).json({
//             success: false,
//             message: "Error uploading image",
//           });
//         }
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
//       new: true,
//     });

//     res.status(200).json({
//       success: true,
//       user: updatedUser,
//     });
//   } catch (error) {
//     console.log("Error in updateProfile: ", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { image, ...otherData } = req.body;

    let updatedData = otherData;

    if (image) {
      // Check if the image is in base64 format
      if (image.startsWith("data:image")) {
        try {
          // Upload image with Cloudinary transformations to resize and optimize
          const uploadResponse = await cloudinary.uploader.upload(image, {
            transformation: [
              {
                width: 500, // Resize to a width of 500px (can adjust based on requirements)
                height: 500, // Resize to a height of 500px (can adjust based on requirements)
                crop: "limit", // Ensures the image doesn't scale beyond the specified dimensions
              },
              {
                quality: "auto", // Automatically adjusts quality
              },
              {
                fetch_format: "auto", // Automatically converts to the best format (e.g., WebP)
              },
            ],
          });

          updatedData.image = uploadResponse.secure_url;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          return res.status(400).json({
            success: false,
            message: "Error uploading image",
          });
        }
      }
    }

    // Update the user's profile data in the database
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
      new: true, // Return the updated document
    });

    res.status(200).json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in updateProfile: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
