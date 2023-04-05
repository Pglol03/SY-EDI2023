function myFunction() {
    var prompt = "Parts Of A Robot";
    createSlidesFromTextPrompt(prompt);
    //insertImageFromTextPrompt(prompt, num);
    // Appends Current Presentation With New Slide.
    //var currentPresentation = SlidesApp.getActivePresentation();
    //currentPresentation.appendSlide(SlidesApp.PredefinedLayout.ONE_COLUMN_TEXT);
  }
  
  function createSlidesFromTextPrompt(inpt) {
    // Define the prompt for the GPT-3 model
    var prompt = "Description of " + inpt + "in numbered points of less than 8 words each";
  
    // Use the OpenAI API to generate text
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      "payload": JSON.stringify({
        "prompt": prompt,
        "max_tokens": 1024,
        "temperature": 0.5,
        "n": 1,
      })
    });
  
    // Get the generated text
    var text = JSON.parse(response).choices[0].text;
    text = text.trim();
    // Get the points from the response
    var points = text.split("\n");
    var numpts = points.length;
  
    //var presentation = SlidesApp.create();
    var presentation = SlidesApp.getActivePresentation();
    var slide = presentation.getSlides()[0];
    var title = slide.getPageElements()[0];
    title.asShape().getText().setText(inpt);
    // // Create the gradient background fill
    // var bg = slide.getBackground();
    // bg.setSolidFill(SlidesApp.);
  
    // // Set the slide background fill to the gradient
    // slide.setBackground(gradientFill);
  
    console.log("Hello, Welcome to Automatic Presentation Maker");
    console.log("You want to make presentation about : "+inpt);
  
    //Logger.log("Created presentation with ID:" + presentation.getId());
    for (let i = 0; i < numpts; i++) {
  
      // Create a new slide
      if (i == numpts - 1) {
        continue;
      }
      else if(points[i+1].length < 5){
        i++;
        continue;
      }
  
      else
        presentation.appendSlide(SlidesApp.PredefinedLayout.ONE_COLUMN_TEXT);
      //  For Points
      sl = i + 1
      var slide = presentation.getSlides()[sl];
  
      // Add the generated text to the slide
      //var title = slide.getPageElementById[0];
      var title = slide.getPageElements()[0];
      var info = slide.getPageElements()[1];
      //console.log(points[i]);
      title.asShape().getText().setText(points[i]);
  
      //info.asShape().getText().setText(text);
  
      //  For Images
      var slide = presentation.getSlides()[sl];
  
      // Add the generated image to the slide
      //console.log(points[i]);
      // Define the prompt for the GPT-3 model
      var inrprompt = "please suggest an image of " + points[i];
  
      // Use the OpenAI API to generate text
      var response = UrlFetchApp.fetch("https://api.openai.com/v1/images/generations", {
        "method": "post",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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"
        },
        "payload": JSON.stringify({
          "model": "image-alpha-001",
          "prompt": inrprompt,
          "num_images": 1
        })
      });
  
      // Get the generated text
      var inrtext = JSON.parse(response).data[0].url;
  
      // Insert the image into the presentation
      var image = slide.insertImage(inrtext);
      image.setWidth(300);
      image.setHeight(200);
      image.setLeft(380);
      image.setTop(150);
  
      //info.asShape().getText().setText(text);
  
    }
    presentation.appendSlide(SlidesApp.PredefinedLayout.SECTION_HEADER);
    var slide = presentation.getSlides()[sl+1];
    var title = slide.getPageElements()[0];
    title.asShape().getText().setText("Thank You!");
    //console.log(points);
    //console.log(numpts);
  
  }
  
  
  
  function insertImageFromTextPrompt(inpt, num) {
    // Define the prompt for the GPT-3 model
    var prompt = "please suggest an image of " + inpt;
  
    // Use the OpenAI API to generate text
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/images/generations", {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      "payload": JSON.stringify({
        "model": "image-alpha-001",
        "prompt": prompt,
        "num_images": 1
      })
    });
  
    // Get the generated text
    var text = JSON.parse(response).data[0].url;
  
    // Get the current presentation
    var presentation = SlidesApp.getActivePresentation().getSlides()[0];
  
    // Insert the image into the presentation
    var image = presentation.insertImage(text);
    image.setWidth(300);
    image.setHeight(200);
    image.setLeft(380);
    image.setTop(150);
  }
  