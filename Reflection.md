
# **FINAL reflection.md**

```markdown
# Reflection

Building this IP Address Tracker was more challenging than I expected, mainly because of the different APIs I attempted to use throughout the project. At first, I tried to use the original recommended API, but I immediately ran into issues such as CORS errors, missing access-control headers, and 403 response codes. Some APIs required API keys, others blocked local requests, and some returned incomplete data like missing ISP or timezone fields. Because of all these issues, I spent a lot of time testing, debugging, and switching between various services just to find one that worked consistently in a simple HTML/CSS/JS environment.  

I also struggled with browser-level tracking prevention, which caused requests to fail silently in Microsoft Edge. This made debugging even harder because the problem wasn’t with the code—it was the browser blocking external resources. I had to learn how different browsers handle CORS, privacy settings, and third-party requests.

Because of these issues listed above I did not know what the real root cause was so I wasted time deleting my repositories and starting over to just be faced with the same problem or a new ones.

Another challenge was dealing with inconsistent JSON structures between APIs. Some returned `country_name`, others used `country`, some provided `org` instead of `isp`, and timezone data was sometimes missing entirely. To fix this, I wrote a normalization layer to standardize how the project reads data.

I also had trouble with images not loading in the UI. The issue ended up being the folder structure and file naming, reminding me how strict browsers are with paths and case sensitivity.

Overall, I learned how to troubleshoot APIs, debug network requests, handle CORS errors, work with third-party data, and carefully structure front-end projects. These struggles helped me gain confidence in solving real-world development problems.
