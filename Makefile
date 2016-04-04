del:
	rm -Rf .git
	git init
	git add .
	git commit -m'начал с нуля'
	git remote add origin git@rp.indev-group.eu:root/arhont.git
	git push -u -f origin --all
