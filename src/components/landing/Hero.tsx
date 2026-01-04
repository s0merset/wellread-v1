import { Button } from "@/components/ui/button";

const userAvatars = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCfu2NqPEnEY775obA6-gSYtVTJAPCMYUvp6a1Cs1Vuvk70iar04nB83nuyfFy0pUL67QCaKKxJC_euzAUpLniljjI5Vul4bABgOmFBBCOS1e6hRwpo9yA5_hO83ksP7CIJ87CkTqUCRcr2Mj6j9xAmUaLQ2RCN1wJGOW3pcgM63AQQszZZqiwNL_4SXFvO9ZUAYLx71ZwvZMjWoVGUUtRyEfa4yaQuuZagJlRkpCe6UNCk1-8xNGwY9qlurRMUIm9CPHOFnGmutw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDagncaG-N6y5fWq7yhvTtRo3CfD9p-KzMCZq3NdO2laOA3K0T9Itxzc2eSBNW9qVYkKi3b3m9bGWPpc5SiaU77aRPxzq9rr1j_AfpZUnndkffyai3ZQfcr3PdrQpao6RHYUV_2nJdZtHgO1L7NCBPleD129IqrwyA8L_vT8ET2ZEcTw6RBckI_5_-GWRuXXOQ_S2jQMNE0DQCQcxIJ-O4QsjqVLoPQxl-NouVlfAzBTaJ4L27FwTS9IZqXehkWiDCF5yHPcU1cZQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCD4BvTfvhZ8F5QC4pwd82LvRavsS6LT5psme_sXqN7-E6V49J_m4Z74XwCvthMuB4iiq4m3OX8-a2Fl9DlOBAnozoH2Z7averVt1pl18WMhk_8rYeK1UIpOB7Qi6Ep9myIdO8JMXv80gviKr-9dC8Lt5yMEsfn_4_cXeKbybo9Ud6TSuFhbUPnrvuBrb6p4YWPngUB9rxnDju2N0tWpIk9nBXDSVG1xP-pUl-h-w5V4y2Kp0a-kNtbsOYa-sfqTkeQQsah-rytDg",
];

const bookCovers = [
  [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBw_NJu_ByYevLS1vefAredD62Asz6nd_x6Y4A7aK7--O8muQx-tGYJfdVYsJX0JAe1aaEHPDuyYifMey3fEO7mdjFE8ucYKTwErfjOXGKH-r1iSH1h-X5aPxtI7rIU_Ihruvvf0VlUWqxa-i09Wu7QD1sGf5H7J-gVK0RPodJz0OX0ZIyLw5YOvejDk5OjCS1u6CEIr-Hpxktx0Z1gNl_by-A5rVpSjqLjZp9_2kj06Wd0M0H5SHvmcVuBtIkCqoLF41qcaA9ggQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCuCeDLft8N6izeFC-Dt94xY79Eq3r4BGSijMnt75WX_hfT13uVRoVadKeG8QqGrrZy3wYbQKVppLiLvUk4VLxxGTH0-S9jFeYtCgwYX3vCOYVl1FWCM0mQ2_81uM0_DHTAmT-rtfoprPxwhYcEUfZPuSciN5LqYYJvMEzjMoT3aVwMGW5YLjnsnuX4KEmXWRLIXGIX8a3v3ec77ZF6R1DcdWTMgNXn8urbIcQQCzWh7IG6uL5bJY0NyRfKstOOYfAoVW4XoJjZqg",
  ],
  [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBvTPIoUL1IpyTWdB3tCZepkFeVjS6QAauozh2S1xustHWRU-XZZUHTONNlNzHHn5j0c-SNYPJA462T0h4ZTA5e5pXtc8PNtYvUV6uNXaqd8uOeC_Uj5GXzGXfH4sBKqpLWh_LnqTeUWYcfP4JZFjzFvsi3LWttqkF2Kg8HgcX-hoFYCisYjcJUfY6xw8n2jqDcsaiGj614WWgEu80uQhdQ6y-DofPJl2WNOxhCo9rTwwbND206AA8lwqCBM7iMq--tqFFJhRdpyg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDcitWzBGBSgU88ohCzqLsU9CTVNJ-3iQ3frVYt-ZUBPqw_nsnaSL2tBQnDDJOxIm5jryOgt6Eknt6q5xZiM3BHYuZ7w4lqnI5ycGXapNFsuNLIwYi1OehLJVYTO6vFYVjfIt5W4_R12qkb6A-ct7PVVaPXccT6P3qLspvsPc-uREepFCdbsDYaIb6IquZfNUtbQ3NjY-gmBJozP59HN1NU0EZUDRLs7k4iHYfbYEZdD-Rpt6QCGMpsRZaMsq_HYKv0pPwDJTcog",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCLl0_EywPCg3nAsBex13YBgailzCg-vifIjzX_AkCRSj_JIauktadkw6bbSk2PVNJLlNphdPlYVIzTn0pyFqVCEXt1gfWlZGcVP0LFwdmYJCnwfNZB74kF5ltG8H5IXCntmNxbzH9iIxy7bpi1L36F1bKmB-Sza7-lTZHLMllmifvy61STUIEZxkboJt5BixLsDHQQwFrBOkAEStzoEgrchUAbfDMWO9eiLcXTwgHZmqmmbweLtAPb5TqB3oUzQSMz8LOfAsG43A",
  ],
  [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvsccvLR_8aXuJ2GxxhPcYnG1XgqiRbzVjd9H_uIl8ZYsFbjsDV4qYdOESuoruwT3EJNkL8Dc_pQ-foBFDFDDGElGlf6aD_Ze2G-9GxVTC_Y5PZQ1ttn1aGQjhr3r3ZvFvyWT67ByJMqBSN26FeqExgs2ppktTjrvfTmqvbLBsRFzzfuYnJYNAHV5eP4zIDouQJCMuyKNZ3jzEbGqnYkoRv0KPe-1LdTBTPHtotg_HPIar0Q-ZzwUYNoPYfX8enR3HZO8Npa2T6Q",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCJ9grDe8lUXMwo82q3pSwnRRCMdj41YGOQyYp3ktggzBseMeIcSNV-lXbIXbkD5jM3k8MK1UUn018Za85tOUOMjST5zsIWJ71p9iA40X7x_djHfq86NFvscOF3m2mmuuwYnOvFFWlS8GQqqgmlCBOwe6OBXleDZF2RkVtEJt6kdIeN9yk5UEDz_CkeQejIlH-l0ePKFN3OtHhP9KghIOloamw74geVxI9_A_rHzhUnM9mWmRuxdU1Z7PDp8DRKdNtygfprIwTkIA",
  ],
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      {/* Abstract background glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-40 -left-20 size-[300px] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left content */}
          <div className="flex flex-col gap-6 text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your Life in <span className="text-primary">Books</span>.
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-lg">
              Track what you read, discover your next favorite, and see what friends are saying. The ultimate social platform for book lovers.
            </p>
            <div className="mt-4 flex flex-wrap gap-4">
              <Button size="lg" className="h-12 min-w-[140px] shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                Create Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[140px] border-surface-highlight bg-surface/50 backdrop-blur-sm hover:bg-surface-highlight hover:-translate-y-0.5 transition-all"
              >
                Browse Books
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {userAvatars.map((avatar, index) => (
                  <div
                    key={index}
                    className="size-8 rounded-full border-2 border-background bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url("${avatar}")` }}
                  />
                ))}
              </div>
              <p>Join 50,000+ readers sharing their library.</p>
            </div>
          </div>

          {/* Right - Book collage */}
          <div className="relative w-full aspect-[4/3] lg:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 lg:hidden" />
            <div className="grid grid-cols-3 gap-4 rotate-[-6deg] scale-110 opacity-90 hover:scale-[1.12] hover:rotate-[-4deg] transition-all duration-700 ease-in-out">
              {bookCovers.map((column, colIndex) => (
                <div key={colIndex} className={`space-y-4 ${colIndex === 0 ? 'pt-12' : colIndex === 2 ? 'pt-8' : ''}`}>
                  {column.map((cover, coverIndex) => (
                    <div
                      key={coverIndex}
                      className={`aspect-[2/3] w-full rounded-lg bg-cover bg-center shadow-2xl ${
                        colIndex === 1 && coverIndex === 1 ? 'ring-2 ring-primary/50' : ''
                      }`}
                      style={{ backgroundImage: `url("${cover}")` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;