sed -n 's#.*\/in/\([^/]*\)/.*#https://www.linkedin.com/in/\1/#p' a.txt | uniq > final2.txt
→ without numbering

sed -n 's#.*\/in/\([^/]*\)/.*#https://www.linkedin.com/in/\1/#p' a.txt | uniq | awk '{n++; print NR, $0}' > final2.txt
→ with numbering to check the total number

sed -n 's#.*\/in/\([^/]*\)/.*#\1#p' a.txt | uniq > final4.txt
→ for id only (*this one will be used*)

And install tools from requirements.txt
And if any error comes up in main.py then check the code. Elements names sometimes differ.
And the code can handle if the message thread opens up, pop up opens up, or the extra pop up opens up as previously the code crashes if anyone of that comes up in front. Now it can handle a lot better from my previous code
