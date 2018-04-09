## Project Post Mortem

#### Approach and Process

1. **What in my process and approach to this project would I do differently next time?**

   - I would refactor my code
   - I would spend more time understanding the frameworks that I am using eg. the node modules

1. **What in my process and approach to this project went well that I would repeat next time?**

   - I thought I approached the planning and development of my web game well. I researched on my framework options thoroughly; and in the actual implementation, I specifically utilized Semantic UI and jQuery really well.

#### Code and Code Design

1. **What in my code and program design in the project would I do differently next time?**

   - I can refactor my code such that it is more condensed
   - My jQuery code is a little messy
   - Insert more comments

1. **What in my code and program design in the project went well? Is there anything I would do the same next time?**

   - I did a good job of utlizing the Semantic UI framework
   - I felt I did a good job of accounting for edge cases eg. null pointer exceptions
   - I felt I did a good job on the UX/UI side eg. with the loading bars
   
   - I felt I did a good job of defining and designing the MVCs of my application

   - Made use of passing in query parameters, see example below:

   ```
   setTimeout(function() {
     response.redirect(`/articles/${request.params.id}?success=true`);
   }, 3000);
   ```

   - Made use of helper functions, see example below:

   ```
   // helper function
   function uniq(a) {
     var seen = {};
     return a.filter(function(item, index) {
         return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
     });
   }
   ```

   - Moving forward, I will focus on implementing a better text-summarization algorithm,


  For each, please include code examples.
  1. Code snippet up to 20 lines.
  2. Code design documents or architecture drawings / diagrams.
